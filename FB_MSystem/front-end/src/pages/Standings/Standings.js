import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './Standings.module.css';
import SeasonSelector from '../../components/SeasonSelector/SeasonSelector';

function Standings({ API_URL }) {
    const navigate = useNavigate();
    const [selectedSeason, setSelectedSeason] = useState('');
    const [standings, setStandings] = useState([]);
    const [seasonsStandings, setSeasonsStandings] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [notFound, setNotFound] = useState(false);
    const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' });

    useEffect(() => {
        const fetchSeasons = async () => {
            try {
                const response = await fetch(`${API_URL}/seasons`);
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();
                setSeasonsStandings(data.seasons.filter(season => season !== 'all'));
            } catch (error) {
                console.error("Error fetching seasons:", error);
                setError("Failed to load seasons.");
            }
        };

        fetchSeasons();
    }, []);

    useEffect(() => {
        if (!selectedSeason) {
            setStandings([]);
            setSortConfig({ key: null, direction: 'ascending' });
            setNotFound(false);
            return;
        }

        const fetchStandings = async () => {
            setLoading(true);
            setError(null);
            setNotFound(false);
            try {
                const response = await fetch(`${API_URL}/standings?season=${selectedSeason}`);
                if (!response.ok) {
                    if (response.status === 404) {
                        console.log(`Standings not found for season: ${selectedSeason}`);
                        setNotFound(true);
                        setStandings([]);
                    } else {
                        throw new Error(`HTTP error! status: ${response.status}`);
                    }
                    return;
                }
                const data = await response.json();
                console.log("Dữ liệu bảng xếp hạng từ API:", data); // Debug API response
                setStandings(data);
            } catch (error) {
                console.error("Lỗi khi fetch bảng xếp hạng:", error);
                setError("Failed to load standings.");
                setStandings([]);
            } finally {
                setLoading(false);
            }
        };

        fetchStandings();
    }, [selectedSeason]);

    const handleSeasonChange = (season) => {
        console.log("Mùa giải được chọn:", season); // Debug season selection
        setSelectedSeason(season);
    };

    const requestSort = (key) => {
        let direction = 'ascending';
        if (sortConfig.key === key && sortConfig.direction === 'ascending') {
            direction = 'descending';
        }
        setSortConfig({ key, direction });
    };

    const sortedStandings = useMemo(() => {
        const sortableStandings = [...standings];
        if (sortConfig.key !== null) {
            sortableStandings.sort((a, b) => {
                if (a[sortConfig.key] < b[sortConfig.key]) {
                    return sortConfig.direction === 'ascending' ? -1 : 1;
                }
                if (a[sortConfig.key] > b[sortConfig.key]) {
                    return sortConfig.direction === 'ascending' ? 1 : -1;
                }
                return 0;
            });
        }
        return sortableStandings;
    }, [standings, sortConfig]);

    const getSortIndicator = (key) => {
        if (sortConfig.key === key) {
            return sortConfig.direction === 'ascending' ? "↑" : "↓";
        }
        return "";
    };

    if (loading) {
        return <div>Đang tải dữ liệu bảng xếp hạng...</div>;
    }

    if (error) {
        return <div>Lỗi: {error}</div>;
    }

    const handleRowClick = (teamId, seasonId) => {
        console.log(`handleRowClick - Team ID: ${teamId}, Season ID: ${seasonId}`); // Debug handleRowClick
        navigate(`/teams/${teamId}?season=${seasonId}`);
    };

    return (
        <div className={styles.standingsContainer}>
            <h2 className={styles.standingsTitle}>Bảng xếp hạng</h2>
            {seasonsStandings.length > 0 && (
                <SeasonSelector
                    onSeasonChange={handleSeasonChange}
                    seasons={seasonsStandings}
                    selectedSeason={selectedSeason}
                />
            )}

            <div className={styles.tableWrapper}>
                <table className={styles.standingsTable}>
                    <thead>
                        <tr>
                            <th onClick={() => requestSort('rank')}>Hạng {getSortIndicator('rank')}</th>
                            <th onClick={() => requestSort('name')}>Đội {getSortIndicator('name')}</th>
                            <th onClick={() => requestSort('played')}>Trận {getSortIndicator('played')}</th>
                            <th onClick={() => requestSort('won')}>Thắng {getSortIndicator('won')}</th>
                            <th onClick={() => requestSort('drawn')}>Hòa {getSortIndicator('drawn')}</th>
                            <th onClick={() => requestSort('lost')}>Thua {getSortIndicator('lost')}</th>
                            <th onClick={() => requestSort('points')}>Điểm {getSortIndicator('points')}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {selectedSeason ? (
                            sortedStandings.length > 0 ? (
                                sortedStandings.map((team) => {
                                    console.log("Đội trong map:", team); // Debug team object in map
                                    return (
                                        <tr
                                            key={`${team.rank}-${team.name}-${team.season}`}
                                            onClick={() => handleRowClick(team.id, selectedSeason)}
                                            className={styles.standingsRow}
                                        >
                                            <td>{team.rank}</td>
                                            <td className={styles.teamName}>{team.name}</td>
                                            <td>{team.played}</td>
                                            <td>{team.won}</td>
                                            <td>{team.drawn}</td>
                                            <td>{team.lost}</td>
                                            <td>{team.points}</td>
                                        </tr>
                                    );
                                })
                            ) : loading ? (
                                <tr><td colSpan="7" style={{ textAlign: 'center' }}>Đang tải dữ liệu bảng xếp hạng...</td></tr>
                            ) : notFound ? (
                                <tr><td colSpan="7" style={{ textAlign: 'center' }}>Không tìm thấy bảng xếp hạng cho mùa giải này.</td></tr>
                            ) : error ? (
                                <tr><td colSpan="7" style={{ textAlign: 'center' }}>Lỗi: {error}</td></tr>
                            ) : (
                                <tr><td colSpan="7" style={{ textAlign: 'center' }}>Không có dữ liệu cho mùa giải này.</td></tr>
                            )
                        ) : (
                            <tr><td colSpan="7" style={{ textAlign: 'center' }}>Vui lòng chọn một mùa giải</td></tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default Standings;