import React, { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./LookUpSeason.module.css";

function LookUpSeason({ API_URL }) {
    const navigate = useNavigate();
    const [teamStatistics, setTeamStatistics] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' });

    useEffect(() => {
        const fetchTeamStatistics = async () => {
            setLoading(true);
            setError(null);
            const url = `${API_URL}/teams/position`;
            console.log("LookUpSeason: Fetching team statistics from:", url); // Debugging URL

            try {
                const response = await fetch(url);
                console.log("LookUpSeason: Response status:", response.status); // Debugging response status
                if (!response.ok) {
                    console.error("LookUpSeason: HTTP error details:", response); // More detailed error
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();
                console.log("LookUpSeason: Dữ liệu thống kê đội bóng từ API:", data);
                setTeamStatistics(data.doiBong);
            } catch (error) {
                console.error("LookUpSeason: Lỗi khi tải dữ liệu thống kê đội bóng:", error);
                setError("Failed to load team statistics.");
            } finally {
                setLoading(false);
            }
        };

        fetchTeamStatistics();
    }, [API_URL]);

    const requestSort = (key) => {
        let direction = 'ascending';
        if (sortConfig.key === key && sortConfig.direction === 'ascending') {
            direction = 'descending';
        }
        setSortConfig({ key, direction });
    };

    const sortedStatistics = useMemo(() => {
        const sortableStatistics = [...teamStatistics];
        if (sortConfig.key !== null) {
            sortableStatistics.sort((a, b) => {
                const aValue = a[sortConfig.key];
                const bValue = b[sortConfig.key];

                if (typeof aValue === 'string' && typeof bValue === 'string') {
                    return sortConfig.direction === 'ascending' ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue);
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
        return sortableStatistics;
    }, [teamStatistics, sortConfig]);

    const getSortIndicator = (key) => {
        if (sortConfig.key === key) {
            return sortConfig.direction === 'ascending' ? "↑" : "↓";
        }
        return "";
    };

    if (loading) {
        return <div>Đang tải dữ liệu...</div>;
    }

    if (error) {
        return <div>Lỗi: {error}</div>;
    }

    return (
        <div className={styles.standingsContainer}>
            <h2 className={styles.standingsTitle}>Thống kê thành tích các đội bóng</h2>
            <div className={styles.tableWrapper}>
                <table className={styles.standingsTable}>
                    <thead>
                        <tr>
                            <th onClick={() => requestSort('name')}>Tên đội {getSortIndicator('name')}</th>
                            <th onClick={() => requestSort('participations')}>Số lần tham gia {getSortIndicator('participations')}</th>
                            <th onClick={() => requestSort('wins')}>Số lần vô địch {getSortIndicator('wins')}</th>
                            <th onClick={() => requestSort('runnerUps')}>Số lần á quân {getSortIndicator('runnerUps')}</th>
                            <th onClick={() => requestSort('thirdPlaces')}>Số lần hạng 3 {getSortIndicator('thirdPlaces')}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {sortedStatistics.length > 0 ? (
                            sortedStatistics.map((team) => (
                                <tr key={team.TenDoiBong} className={styles.standingsRow}>
                                    <td>{team.TenDoiBong}</td>
                                    <td>{team.participations}</td>
                                    <td>{team.wins}</td>
                                    <td>{team.runnerUps}</td>
                                    <td>{team.thirdPlaces}</td>
                                </tr>
                            ))
                        ) : (
                            <tr><td colSpan="5" style={{ textAlign: 'center' }}>Không có dữ liệu</td></tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default LookUpSeason;