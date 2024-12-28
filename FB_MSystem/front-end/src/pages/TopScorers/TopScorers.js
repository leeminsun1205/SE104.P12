// --- START OF FILE TopScorers.js ---

import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styles from './TopScorers.module.css';

function TopScorers({ API_URL }) {
    const { MaMuaGiai } = useParams();
    const navigate = useNavigate();
    const [topScorers, setTopScorers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [teams, setTeams] = useState({});
    const [notFound, setNotFound] = useState(false);
    const [players, setPlayers] = useState({});
    const [season, setSeasons] = useState({});
    const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' });
    useEffect(() => {
        const fetchSeasons = async () => {
            try {
                const response = await fetch(`${API_URL}/mua-giai`);
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();
                setSeasons(data.muaGiai.filter(season => season.MaMuaGiai === MaMuaGiai));
            } catch (error) {
                console.error("Error fetching seasons:", error);
                setError("Failed to load seasons.");
            }
        };

        fetchSeasons();
    }, [API_URL]);
    useEffect(() => {
        if (!MaMuaGiai) {
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
                const response = await fetch(`${API_URL}/vua-pha-luoi/mua-giai/${MaMuaGiai}`); // Endpoint gọi backend để lấy top scorer
                if (!response.ok) {
                    if (response.status === 404) {
                        setNotFound(true);
                        setTopScorers([]);
                    } else {
                        throw new Error(`HTTP error! status: ${response.status}`);
                    }
                    return;
                }
                const data = await response.json();
                setTopScorers(data); // Cập nhật trực tiếp state với dữ liệu từ backend
            } catch (error) {
                console.error("Error fetching top scorers:", error);
                setError("Failed to load top scorers.");
                setTopScorers([]);
            } finally {
                setLoading(false);
            }
        };

        fetchTopScorers();
    }, [MaMuaGiai, API_URL]);

    const requestSort = (key) => {
        let direction = 'ascending';
        if (sortConfig.key === key && sortConfig.direction === 'ascending') {
            direction = 'descending';
        }
        setSortConfig({ key, direction });
    };

    const sortedTopScorers = useMemo(() => {
        const sortableScorers = [...topScorers];
        if (sortConfig.key) {
            sortableScorers.sort((a, b) => {
                const aValue = a[sortConfig.key];
                const bValue = b[sortConfig.key];
                if (aValue < bValue) {
                    return sortConfig.direction === 'ascending' ? -1 : 1;
                }
                if (aValue > bValue) {
                    return sortConfig.direction === 'ascending' ? 1 : -1;
                }
                return 0;
            });
        }
        return sortableScorers;
    }, [topScorers, sortConfig]);

    const getSortIndicator = (key) => {
        if (sortConfig.key === key) {
            return sortConfig.direction === 'ascending' ? '↑' : '↓';
        }
        return '';
    };

    if (loading) {
        return <div>Đang tải danh sách vua phá lưới...</div>;
    }

    if (error) {
        return <div>Lỗi khi tải dữ liệu: {error.message}</div>;
    }

    return (
        <div className={styles.topScorersPage}>
            <h2 className={styles.title}>Vua phá lưới - {season[0].TenMuaGiai}</h2>
            {sortedTopScorers.length > 0 ? (
                <table className={styles.scorersTable}>
                    <thead>
                        <tr>
                            <th>Hạng</th>
                            <th onClick={() => requestSort('MaCauThu')}> {/* Sort by MaCauThu */}
                                Cầu thủ {getSortIndicator('MaCauThu')}
                            </th>
                            <th onClick={() => requestSort('MaDoiBong')}>
                                Đội {getSortIndicator('MaDoiBong')}
                            </th>
                            <th onClick={() => requestSort('SoBanThang')}>
                                Số bàn thắng {getSortIndicator('SoBanThang')}
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {sortedTopScorers.map((scorer, index) => (
                            <tr key={index}>
                                <td>{index + 1}</td>
                                <td>{scorer.CauThu.TenCauThu || 'Unknown Player'}</td> {/* Display player name */}
                                <td>{scorer.DoiBong.TenDoiBong || 'Unknown Team'}</td>
                                <td>{scorer.SoBanThang}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : (
                <p>Không có bàn thắng nào được ghi trong mùa giải này.</p>
            )}
            <button className={styles.backButton} onClick={() => navigate(`/mua-giai/${MaMuaGiai}`)}>
                Quay lại thông tin mùa giải
            </button>
        </div>
    );
}

export default TopScorers;  