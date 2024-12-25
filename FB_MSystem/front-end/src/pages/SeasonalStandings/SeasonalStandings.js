// SeasonalStandings.js
import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styles from './SeasonalStandings.module.css'; // Tạo một file CSS riêng

function SeasonalStandings({ API_URL }) {
    const { seasonId } = useParams();
    const navigate = useNavigate();
    const [standings, setStandings] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [notFound, setNotFound] = useState(false);
    const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' });

    useEffect(() => {
        const fetchStandings = async () => {
            setLoading(true);
            setError(null);
            setNotFound(false);
            try {
                const response = await fetch(`${API_URL}/standings?season=${seasonId}`);
                if (!response.ok) {
                    if (response.status === 404) {
                        console.log(`Standings not found for season: ${seasonId}`);
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
    }, [API_URL, seasonId]);

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
        return sortableStandings;
    }, [standings, sortConfig]);

    const getSortIndicator = (key) => {
        if (sortConfig.key === key) {
            return sortConfig.direction === 'ascending' ? "↑" : "↓";
        }
        return "";
    };

    const handleRowClick = (teamId) => {
        navigate(`/teams/${teamId}?season=${seasonId}`);
    };

    if (loading) {
        return <div>Đang tải dữ liệu bảng xếp hạng...</div>;
    }

    if (error) {
        return <div>Lỗi: {error}</div>;
    }

    return (
        <div className={styles.standingsContainer}>
            <h2 className={styles.standingsTitle}>Bảng xếp hạng - Mùa giải {seasonId}</h2>
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
                            <th onClick={() => requestSort('goalsFor')}>Bàn thắng {getSortIndicator('goalsFor')}</th>
                            <th onClick={() => requestSort('goalsAgainst')}>Bàn thua {getSortIndicator('goalsAgainst')}</th>
                            <th onClick={() => requestSort('goalDifference')}>Hiệu số {getSortIndicator('goalDifference')}</th>
                            <th onClick={() => requestSort('points')}>Điểm {getSortIndicator('points')}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {notFound ? (
                            <tr><td colSpan="10" style={{ textAlign: 'center' }}>Không tìm thấy bảng xếp hạng cho mùa giải này.</td></tr>
                        ) : sortedStandings.length > 0 ? (
                            sortedStandings.map((team) => (
                                <tr
                                    key={`${team.rank}-${team.name}`}
                                    onClick={() => handleRowClick(team.id)}
                                    className={styles.standingsRow}
                                >
                                    <td>{team.rank}</td>
                                    <td className={styles.teamName}>{team.name}</td>
                                    <td>{team.played}</td>
                                    <td>{team.won}</td>
                                    <td>{team.drawn}</td>
                                    <td>{team.lost}</td>
                                    <td>{team.goalsFor}</td>
                                    <td>{team.goalsAgainst}</td>
                                    <td>{team.goalDifference}</td>
                                    <td>{team.points}</td>
                                </tr>
                            ))
                        ) : (
                            <tr><td colSpan="10" style={{ textAlign: 'center' }}>Không có dữ liệu cho mùa giải này.</td></tr>
                        )}
                    </tbody>
                </table>
            </div>
            <button className={styles.backButton} onClick={() => navigate(`/seasons/${seasonId}`)}>
                Quay lại thông tin mùa giải
            </button>
        </div>
    );
}

export default SeasonalStandings;