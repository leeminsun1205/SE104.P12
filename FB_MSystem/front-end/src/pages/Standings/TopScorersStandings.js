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
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 6;
    const [teams, setTeams] = useState({});

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
        const fetchSeasonTeams = async () => {
            if (selectedSeason) {
                try {
                    const response = await fetch(`${API_URL}/teams?season=${selectedSeason}`);
                    if (!response.ok) {
                        throw new Error(`Could not fetch teams for season: ${response.status}`);
                    }
                    const data = await response.json();
                    const teamsMap = {};
                    data.teams.forEach(team => {
                        teamsMap[team.id] = team.name;
                    });
                    setTeams(teamsMap);
                } catch (error) {
                    console.error("Error fetching teams:", error);
                    setError(error);
                }
            } else {
                setTeams({});
            }
        };

        fetchSeasonTeams();
    }, [API_URL, selectedSeason]);

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
                setCurrentPage(1);
            }
        };

        const processMatchData = async (matches) => {
            const playerGoals = {};
            matches.forEach(match => {
                if (match.goals) {
                    match.goals.forEach(goal => {
                        const playerId = goal.player;
                        const teamId = goal.team;
                        playerGoals[playerId] = {
                            goals: (playerGoals[playerId]?.goals || 0) + 1,
                            teamId: teamId
                        };
                    });
                }
            });

            const scorersArray = Object.entries(playerGoals)
                .map(([playerId, data]) => ({ playerId: parseInt(playerId), goals: data.goals, teamId: data.teamId }))
                .sort((a, b) => b.goals - a.goals);

            if (selectedSeason) {
                try {
                    const response = await fetch(`${API_URL}/teams?season=${selectedSeason}`);
                    if (!response.ok) {
                        throw new Error(`Could not fetch teams for season: ${response.status}`);
                    }
                    const teamsData = await response.json();
                    let allPlayers = [];
                    for (const team of teamsData.teams) {
                        const playersResponse = await fetch(`${API_URL}/teams/${team.id}/players?season=${selectedSeason}`);
                        if (playersResponse.ok) {
                            const playersData = await playersResponse.json();
                            allPlayers = [...allPlayers, ...playersData.players];
                        }
                    }

                    const playerMap = new Map();
                    allPlayers.forEach(player => playerMap.set(player.id, player.name));

                    const scorersWithNames = scorersArray.map(scorer => ({
                        ...scorer,
                        playerName: playerMap.get(scorer.playerId) || 'Unknown Player'
                    }));
                    setTopScorers(scorersWithNames);

                } catch (error) {
                    console.error("Error fetching players for top scorers:", error);
                    setError("Failed to load player names for top scorers.");
                    setTopScorers(scorersArray);
                }
            } else {
                setTopScorers(scorersArray);
            }
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

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = sortedTopScorers.slice(indexOfFirstItem, indexOfLastItem);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    const pageNumbers = [];
    for (let i = 1; i <= Math.ceil(sortedTopScorers.length / itemsPerPage); i++) {
        pageNumbers.push(i);
    }

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
                            <th onClick={() => requestSort('teamId')}>Đội {getSortIndicator('teamId')}</th>
                            <th onClick={() => requestSort('goals')}>Bàn thắng {getSortIndicator('goals')}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {selectedSeason ? (
                            currentItems.length > 0 ? (
                                currentItems.map((scorer, index) => (
                                    <tr key={`${index}-${scorer.playerId}`}>
                                        <td>{(currentPage - 1) * itemsPerPage + index + 1}</td>
                                        <td className={styles.playerName}>{scorer.playerName}</td>
                                        <td>{teams[scorer.teamId] || 'Unknown Team'}</td>
                                        <td>{scorer.goals}</td>
                                    </tr>
                                ))
                            ) : loading ? (
                                <tr><td colSpan="4" style={{ textAlign: 'center' }}>Đang tải dữ liệu vua phá lưới...</td></tr>
                            ) : notFound ? (
                                <tr><td colSpan="4" style={{ textAlign: 'center' }}>Không tìm thấy dữ liệu vua phá lưới cho mùa giải này.</td></tr>
                            ) : error ? (
                                <tr><td colSpan="4" style={{ textAlign: 'center' }}>Lỗi: {error}</td></tr>
                            ) : (
                                <tr><td colSpan="4" style={{ textAlign: 'center' }}>Không có dữ liệu cho mùa giải này.</td></tr>
                            )
                        ) : (
                            <tr><td colSpan="4" style={{ textAlign: 'center' }}>Vui lòng chọn một mùa giải</td></tr>
                        )}
                    </tbody>
                </table>
            </div>
            {sortedTopScorers.length > itemsPerPage && (
                <div className={styles.pagination}>
                    <button onClick={() => paginate(currentPage - 1)} disabled={currentPage === 1}>
                        Trước
                    </button>
                    {pageNumbers.map(number => (
                        <button key={number} onClick={() => paginate(number)} className={currentPage === number ? styles.active : ''}>
                            {number}
                        </button>
                    ))}
                    <button onClick={() => paginate(currentPage + 1)} disabled={currentPage === pageNumbers.length}>
                        Sau
                    </button>
                </div>
            )}
        </div>
    );
}

export default TopScorersStandings;