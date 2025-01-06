import React, { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import TeamSelector from "../../components/TeamSelector/TeamSelector";
import styles from "./LookUpAchievements.module.css";

function LookUpAchievements({ API_URL }) {
    const navigate = useNavigate();
    const [selectedTeam, setSelectedTeam] = useState("");
    const [standings, setStandings] = useState([]);
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
                console.log("Dữ liệu đội bóng từ API:", data);
                setAvailableTeams(data.doiBong);
            } catch (error) {
                console.error("Lỗi khi tải danh sách đội bóng:", error);
            }
        };

        fetchTeams();
    }, [API_URL]);

    useEffect(() => {
        if (!selectedTeam) {
            setStandings([]);
            setSortConfig({ key: 'season', direction: 'ascending' });
            setNotFound(false);
            return;
        }

        const fetchStandings = async () => {
            setLoading(true);
            setError(null);
            setNotFound(false);
            try {
                const response = await fetch(`${API_URL}/thanh-tich/doi-bong/${selectedTeam}`);
                if (!response.ok) {
                    if (response.status === 402) {
                        console.log(`Team not found: ${selectedTeam}`);
                        setNotFound(true);
                        setStandings([]);
                    } else {
                        throw new Error(`HTTP error! status: ${response.status}`);
                    }
                    return;
                }
                const data = await response.json();
                console.log("Dữ liệu giải đấu từ API:", data); // Debug API response
                if (data) {
                    setStandings(data.map((team) => {
                        return {
                            ...team,
                            winner: team.XepHang === 1 ? 'Có' : 'Không',
                            runnerUp: team.XepHang === 2 ? 'Có' : 'Không',
                            thirdPlace: team.XepHang === 3 ? 'Có' : 'Không',
                        };
                    }));
                } else {
                    console.error("Dữ liệu giải đấu không đúng định dạng:", data);
                    setError("Failed to load standings: Invalid data format.");
                    setStandings([]);
                }
            } catch (error) {
                console.error("Lỗi khi fetch dữ liệu giải đấu:", error);
                setError("Failed to load standings.");
                setStandings([]);
            } finally {
                setLoading(false);
            }
        };

        fetchStandings();
    }, [selectedTeam, API_URL]);

    const handleTeamChange = (teamId) => {
        console.log("Đội được chọn:", teamId); // Debug team selection
        setSelectedTeam(teamId);
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
        return sortableStandings;
    }, [standings, sortConfig]);

    const getSortIndicator = (key) => {
        if (sortConfig.key === key) {
            return sortConfig.direction === 'ascending' ? "↑" : "↓";
        }
        return "";
    };

    if (loading) {
        return <div>Đang tải dữ liệu mùa giải...</div>;
    }

    if (error) {
        return <div>Lỗi: {error}</div>;
    }

    const handleRowClick = (seasonId) => {
        console.log(`handleRowClick Season ID: ${seasonId}`); // Debug handleRowClick
        navigate(`/mua-giai/${seasonId}`);
    };

    return (
        <div className={styles.standingsContainer}>
            <h2 className={styles.standingsTitle}>Thành tích đội bóng</h2>
            {availableTeams.length > 0 && (
                <TeamSelector
                    onTeamsChange={handleTeamChange}
                    teams={availableTeams.map(team => ({ id: team.MaDoiBong, name: team.TenDoiBong }))}
                    selectedTeam={selectedTeam}
                    id="teams"
                />
            )}

            <div className={styles.tableWrapper}>
                <table className={styles.standingsTable}>
                    <thead>
                        <tr>
                            <th onClick={() => requestSort('season')}>Mùa giải {getSortIndicator('season')}</th>
                            <th onClick={() => requestSort('win')}>Thắng {getSortIndicator('win')}</th>
                            <th onClick={() => requestSort('loss')}>Thua {getSortIndicator('loss')}</th>
                            <th onClick={() => requestSort('draw')}>Hòa {getSortIndicator('draw')}</th>
                            <th onClick={() => requestSort('position')}>Hạng {getSortIndicator('position')}</th>
                            <th>Số lần tham gia</th>
                        </tr>
                    </thead>
                    <tbody>
                        {selectedTeam ? (
                            sortedStandings.length > 0 ? (
                                sortedStandings.map((item) => {
                                    console.log("Mùa giải trong map:", item); // Debug object in map
                                    return (
                                        <tr
                                            key={`${item.MaMuaGiai}`}
                                            onClick={() => handleRowClick(item.MaMuaGiai)}
                                            className={styles.standingsRow}
                                        >
                                            <td>{item.MuaGiai.TenMuaGiai}</td>
                                            <td>{item.SoTranThang}</td>
                                            <td>{item.SoTranThua}</td>
                                            <td>{item.SoTranHoa}</td>
                                            <td>{item.XepHang}</td>
                                            <td>{standings.length}</td>
                                        </tr>
                                    );
                                })
                            ) : loading ? (
                                <tr><td colSpan="6" style={{ textAlign: 'center' }}>Đang tải dữ liệu lịch sử giải...</td></tr>
                            ) : notFound ? (
                                <tr><td colSpan="6" style={{ textAlign: 'center' }}>Không tìm thấy mùa giải nào có đội.</td></tr>
                            ) : error ? (
                                <tr><td colSpan="6" style={{ textAlign: 'center' }}>Lỗi: {error}</td></tr>
                            ) : (
                                <tr><td colSpan="6" style={{ textAlign: 'center' }}>Không tìm thấy mùa giải nào có đội.</td></tr>
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