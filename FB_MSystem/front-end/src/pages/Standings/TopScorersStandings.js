import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './TopScorersStandings.module.css';
import SeasonSelector from '../../components/SeasonSelector/SeasonSelector';

function TopScorersStandings({ API_URL }) {
    const navigate = useNavigate();
    const [selectedSeason, setSelectedSeason] = useState('');
    const [topScorers, setTopScorers] = useState([]);
    const [availableSeasons, setAvailableSeasons] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [notFound, setNotFound] = useState(false);
    const [sortConfig, setSortConfig] = useState({ key: null, direction: 'descending' });

    useEffect(() => {
        const fetchSeasons = async () => {
            try {
                const response = await fetch(`${API_URL}/seasons`);
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();
                setAvailableSeasons(data.seasons.filter(season => season !== 'all'));
            } catch (error) {
                console.error("Error fetching seasons:", error);
                setError("Failed to load seasons.");
            }
        };

        fetchSeasons();
    }, [API_URL]);

    useEffect(() => {
        if (!selectedSeason) {
            setTopScorers([]);
            setSortConfig({ key: null, direction: 'descending' });
            setNotFound(false);
            return;
        }

        const fetchTopScorers = async () => {
            setLoading(true);
            setError(null);
            setNotFound(false);
            try {
                const response = await fetch(`${API_URL}/matches?season=${selectedSeason}`);
                if (!response.ok) {
                    if (response.status === 404) {
                        console.log(`Matches not found for season: ${selectedSeason}`);
                        setNotFound(true);
                        setTopScorers([]);
                    } else {
                        throw new Error(`HTTP error! status: ${response.status}`);
                    }
                    return;
                }
                const data = await response.json();
                processMatchData(data);
            } catch (error) {
                console.error("Error fetching match data:", error);
                setError("Failed to load top scorers.");
                setTopScorers([]);
            } finally {
                setLoading(false);
            }
        };

        const processMatchData = (matches) => {
            const playerGoals = {};
            matches.forEach(match => {
                if (match.goals) {
                    match.goals.forEach(goal => {
                        const playerName = goal.player;
                        playerGoals[playerName] = (playerGoals[playerName] || 0) + 1;
                    });
                }
            });

            const scorersArray = Object.entries(playerGoals)
                .map(([playerName, goals]) => ({ playerName, goals }))
                .sort((a, b) => b.goals - a.goals);

            setTopScorers(scorersArray);
        };

        fetchTopScorers();
    }, [selectedSeason, API_URL]);

    const handleSeasonChange = (season) => {
        setSelectedSeason(season);
    };

    const requestSort = (key) => {
        let direction = 'ascending';
        if (sortConfig.key === key && sortConfig.direction === 'ascending') {
            direction = 'descending';
        } else if (sortConfig.key === key && sortConfig.direction === 'descending') {
            direction = 'ascending';
        }
        setSortConfig({ key, direction });
    };

    const sortedTopScorers = useMemo(() => {
        const sortableScorers = [...topScorers];
        if (sortConfig.key !== null) {
            sortableScorers.sort((a, b) => {
                const aValue = a[sortConfig.key];
                const bValue = b[sortConfig.key];
                if (typeof aValue === 'number' && typeof bValue === 'number') {
                    return sortConfig.direction === 'ascending' ? aValue - bValue : bValue - aValue;
                } else {
                    if (aValue < bValue) {
                        return sortConfig.direction === 'ascending' ? -1 : 1;
                    }
                    if (aValue > bValue) {
                        return sortConfig.direction === 'ascending' ? 1 : -1;
                    }
                    return 0;
                }
            });
        }
        return sortableScorers;
    }, [topScorers, sortConfig]);

    const getSortIndicator = (key) => {
        if (sortConfig.key === key) {
            return sortConfig.direction === 'ascending' ? "↑" : "↓";
        }
        return "";
    };

    if (loading) {
        return <div>Đang tải dữ liệu vua phá lưới...</div>;
    }

    if (error) {
        return <div>Lỗi: {error}</div>;
    }

    return (
        <div className={styles.topScorersStandingsContainer}>
            <h2 className={styles.topScorersStandingsTitle}>Vua phá lưới</h2>
            {availableSeasons.length > 0 && (
                <SeasonSelector
                    onSeasonChange={handleSeasonChange}
                    seasons={availableSeasons}
                    selectedSeason={selectedSeason}
                />
            )}

            <div className={styles.tableWrapper}>
                <table className={styles.topScorersTable}>
                    <thead>
                        <tr>
                            <th>Hạng</th>
                            <th onClick={() => requestSort('playerName')}>Cầu thủ {getSortIndicator('playerName')}</th>
                            <th onClick={() => requestSort('goals')}>Bàn thắng {getSortIndicator('goals')}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {selectedSeason ? (
                            sortedTopScorers.length > 0 ? (
                                sortedTopScorers.map((scorer, index) => (
                                    <tr key={`${index}-${scorer.playerName}`}>
                                        <td>{index + 1}</td>
                                        <td className={styles.playerName}>{scorer.playerName}</td>
                                        <td>{scorer.goals}</td>
                                    </tr>
                                ))
                            ) : loading ? (
                                <tr><td colSpan="3" style={{ textAlign: 'center' }}>Đang tải dữ liệu vua phá lưới...</td></tr>
                            ) : notFound ? (
                                <tr><td colSpan="3" style={{ textAlign: 'center' }}>Không tìm thấy dữ liệu vua phá lưới cho mùa giải này.</td></tr>
                            ) : error ? (
                                <tr><td colSpan="3" style={{ textAlign: 'center' }}>Lỗi: {error}</td></tr>
                            ) : (
                                <tr><td colSpan="3" style={{ textAlign: 'center' }}>Không có dữ liệu cho mùa giải này.</td></tr>
                            )
                        ) : (
                            <tr><td colSpan="3" style={{ textAlign: 'center' }}>Vui lòng chọn một mùa giải</td></tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default TopScorersStandings;