import React, { useState, useMemo, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import styles from "./LookUpSeason.module.css";

function LookUpSeason({ API_URL }) {
    const navigate = useNavigate();
    const [teamStatistics, setTeamStatistics] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' });
    const [currentPage, setCurrentPage] = useState(1);
    const teamsPerPage = 5;
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        const fetchTeamStatistics = async () => {
            setLoading(true);
            setError(null);
            const url = `${API_URL}/bang-xep-hang/doi-bong/xep-hang`;

            try {
                const response = await fetch(url);
                if (!response.ok) {
                    console.error("LookUpSeason: HTTP error details:", response);
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();
                setTeamStatistics(data.doiBong);
                setCurrentPage(1); // Reset to first page when new data arrives
            } catch (error) {
                console.error("LookUpSeason: Lỗi khi tải dữ liệu thống kê đội bóng:", error);
                setError("Failed to load team statistics.");
            } finally {
                setLoading(false);
            }
        };

        fetchTeamStatistics();
    }, [API_URL]);

    const handleSearch = (event) => {
        setSearchTerm(event.target.value);
        setCurrentPage(1); // Reset to first page when searching
    };

    const requestSort = (key) => {
        let direction = 'ascending';
        if (sortConfig.key === key && sortConfig.direction === 'ascending') {
            direction = 'descending';
        }
        setSortConfig({ key, direction });
    };

    const sortedStatistics = useMemo(() => {
        const sortableStatistics = [...teamStatistics];

        // Apply search filter
        const filteredStatistics = sortableStatistics.filter(team =>
            team.TenDoiBong.toLowerCase().includes(searchTerm.toLowerCase())
        );

        if (sortConfig.key !== null) {
            filteredStatistics.sort((a, b) => {
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
        return filteredStatistics;
    }, [teamStatistics, sortConfig, searchTerm]);

    const getSortIndicator = (key) => {
        if (sortConfig.key === key) {
            return sortConfig.direction === 'ascending' ? "↑" : "↓";
        }
        return "";
    };

    const indexOfLastTeam = currentPage * teamsPerPage;
    const indexOfFirstTeam = indexOfLastTeam - teamsPerPage;
    const currentTeams = useMemo(() => sortedStatistics.slice(indexOfFirstTeam, indexOfLastTeam), [sortedStatistics, currentPage]);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    const pageNumbers = useMemo(() => {
        const pages = [];
        for (let i = 1; i <= Math.ceil(sortedStatistics.length / teamsPerPage); i++) {
            pages.push(i);
        }
        return pages;
    }, [sortedStatistics.length, teamsPerPage]);

    if (loading) {
        return <div>Đang tải dữ liệu...</div>;
    }

    if (error) {
        return <div>Lỗi: {error}</div>;
    }

    return (
        <div className={styles.standingsContainer}>
            <div className={styles.header}>
                <h2 className={styles.standingsTitle}>Thống kê thành tích các đội bóng</h2>
                <Link to="/tra-cuu" className={styles.backButton}>
                    Quay lại
                </Link>
            </div>
            <div className={styles.searchBar}>
                <input
                    type="text"
                    placeholder="Tìm kiếm đội bóng..."
                    value={searchTerm}
                    onChange={handleSearch}
                />
            </div>
            <div className={styles.tableWrapper}>
                <table className={styles.standingsTable}>
                    <thead>
                        <tr>
                            <th onClick={() => requestSort('TenDoiBong')}>Tên đội {getSortIndicator('TenDoiBong')}</th>
                            <th onClick={() => requestSort('SoLanThamGia')}>Số lần tham gia {getSortIndicator('SoLanThamGia')}</th>
                            <th onClick={() => requestSort('TongSoTranThang')}>Tổng số trận thắng {getSortIndicator('TongSoTranThang')}</th>
                            <th onClick={() => requestSort('SoLanVoDich')}>Số lần vô địch {getSortIndicator('SoLanVoDich')}</th>
                            <th onClick={() => requestSort('SoLanAQuan')}>Số lần á quân {getSortIndicator('SoLanAQuan')}</th>
                            <th onClick={() => requestSort('SoLanHangBa')}>Số lần hạng 3 {getSortIndicator('SoLanHangBa')}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentTeams.length > 0 ? (
                            currentTeams.map((team) => (
                                <tr key={team.TenDoiBong} className={styles.standingsRow}>
                                    <td>{team.TenDoiBong}</td>
                                    <td>{team.SoLanThamGia}</td>
                                    <td>{team.TongSoTranThang}</td>
                                    <td>{team.SoLanVoDich}</td>
                                    <td>{team.SoLanAQuan}</td>
                                    <td>{team.SoLanHangBa}</td>
                                </tr>
                            ))
                        ) : (
                            <tr><td colSpan="6" style={{ textAlign: 'center' }}>Không có dữ liệu</td></tr>
                        )}
                    </tbody>
                </table>
            </div>
            <div className={styles.pagination}>
                {pageNumbers.map(number => (
                    <button key={number} onClick={() => paginate(number)} className={currentPage === number ? styles.active : ''}>
                        {number}
                    </button>
                ))}
            </div>
        </div>
    );
}

export default LookUpSeason;