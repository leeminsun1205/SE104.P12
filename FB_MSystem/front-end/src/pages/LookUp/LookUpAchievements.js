import React, { useState, useMemo, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import TeamSelector from "../../components/TeamSelector/TeamSelector";
import styles from "./LookUpAchievements.module.css";

function LookUpAchievements({ API_URL }) {
    const navigate = useNavigate();
    const [selectedTeam, setSelectedTeam] = useState("");
    const [achievements, setAchievements] = useState([]);
    const [availableTeams, setAvailableTeams] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [notFound, setNotFound] = useState(false);
    const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' });

    useEffect(() => {
        const fetchTeams = async () => {
            try {
                const response = await fetch(`${API_URL}/doi-bong`);
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();
                setAvailableTeams(data.doiBong); // Adjust based on actual API response
            } catch (error) {
                console.error("Lỗi khi tải danh sách đội bóng:", error);
            }
        };

        fetchTeams();
    }, [API_URL]);

    useEffect(() => {
        if (!selectedTeam) {
            setAchievements([]);
            setSortConfig({ key: 'TenDoiBong', direction: 'ascending' });
            setNotFound(false);
            return;
        }

        const fetchAchievements = async () => {
            setLoading(true);
            setError(null);
            setNotFound(false);
            try {
                const response = await fetch(`${API_URL}/bang-xep-hang/team-positions`); // Corrected API endpoint for team achievements
                if (!response.ok) {
                    if (response.status === 404) {
                        setNotFound(true);
                        setAchievements([]);
                    } else {
                        throw new Error(`HTTP error! status: ${response.status}`);
                    }
                    return;
                }
                const data = await response.json();
                if (data && data.doiBong) {
                    const teamData = data.doiBong.find(team => team.MaDoiBong === selectedTeam);
                    if (teamData) {
                        setAchievements([teamData]); // Display achievements for the selected team
                    } else {
                        setAchievements([]);
                        setNotFound(true);
                    }
                } else {
                    console.error("Dữ liệu thành tích không đúng định dạng:", data);
                    setError("Failed to load achievements: Invalid data format.");
                    setAchievements([]);
                }
            } catch (error) {
                console.error("Lỗi khi fetch dữ liệu thành tích:", error);
                setError("Failed to load achievements.");
                setAchievements([]);
            } finally {
                setLoading(false);
            }
        };

        fetchAchievements();
    }, [selectedTeam, API_URL]);

    const handleTeamChange = (teamId) => {
        setSelectedTeam(teamId);
    };

    const requestSort = (key) => {
        let direction = 'ascending';
        if (sortConfig.key === key && sortConfig.direction === 'ascending') {
            direction = 'descending';
        }
        setSortConfig({ key, direction });
    };

    const sortedAchievements = useMemo(() => {
        const sortableAchievements = [...achievements];
        if (sortConfig.key !== null) {
            sortableAchievements.sort((a, b) => {
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
        return sortableAchievements;
    }, [achievements, sortConfig]);

    const getSortIndicator = (key) => {
        if (sortConfig.key === key) {
            return sortConfig.direction === 'ascending' ? "↑" : "↓";
        }
        return "";
    };

    if (loading) {
        return <div>Đang tải dữ liệu thành tích...</div>;
    }

    if (error) {
        return <div>Lỗi: {error}</div>;
    }

    // The backend API for team-positions returns aggregated data, not season-specific.
    // You might need a different endpoint to view details of a specific season for a team.
    const handleRowClick = (/* Assuming you have MaMuaGiai available */) => {
        // navigate(`/mua-giai/${seasonId}`); // Adjust this based on your routing and data
    };

    return (
        <div className={styles.standingsContainer}>
            <div className={styles.header}>
                <h2 className={styles.standingsTitle}>Thành tích đội bóng</h2>
                <Link to="/tra-cuu" className={styles.backButton}>
                    Quay lại
                </Link>
            </div>
            {availableTeams.length > 0 && (
                <TeamSelector
                    onTeamsChange={handleTeamChange}
                    teams={availableTeams.map(team => ({ id: team.MaDoiBong, name: team.TenDoiBong }))}
                    selectedTeam={selectedTeam}
                    id="doiBong"
                />
            )}

            <div className={styles.tableWrapper}>
                <table className={styles.standingsTable}>
                    <thead>
                        <tr>
                            <th>Đội bóng</th>
                            <th>Số lần tham gia</th>
                            <th>Số lần vô địch</th>
                            <th>Số lần á quân</th>
                            <th>Số lần hạng ba</th>
                            <th>Tổng số trận thắng</th>
                        </tr>
                    </thead>
                    <tbody>
                        {selectedTeam ? (
                            sortedAchievements.length > 0 ? (
                                sortedAchievements.map((item) => (
                                    <tr
                                        key={item.MaDoiBong} // Use a unique identifier
                                        className={styles.standingsRow}
                                    >
                                        <td>{item.TenDoiBong}</td>
                                        <td>{item.SoLanThamGia}</td>
                                        <td>{item.SoLanVoDich}</td>
                                        <td>{item.SoLanAQuan}</td>
                                        <td>{item.SoLanHangBa}</td>
                                        <td>{item.TongSoTranThang}</td>
                                    </tr>
                                ))
                            ) : loading ? (
                                <tr><td colSpan="6" style={{ textAlign: 'center' }}>Đang tải dữ liệu thành tích...</td></tr>
                            ) : notFound ? (
                                <tr><td colSpan="6" style={{ textAlign: 'center' }}>Không tìm thấy thành tích cho đội này.</td></tr>
                            ) : error ? (
                                <tr><td colSpan="6" style={{ textAlign: 'center' }}>Lỗi: {error}</td></tr>
                            ) : (
                                <tr><td colSpan="6" style={{ textAlign: 'center' }}>Không có dữ liệu thành tích.</td></tr>
                            )
                        ) : (
                            <tr><td colSpan="6" style={{ textAlign: 'center' }}>Vui lòng chọn một đội</td></tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default LookUpAchievements;