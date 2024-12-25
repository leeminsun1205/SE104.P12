import React, { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import TeamSelector from "../../components/TeamSelector.js/TeamSelector";
import styles from "./LookUpSeason.module.css";

function LookUpSeason({ API_URL }) {
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
            const response = await fetch(`${API_URL}/teams/all`);
            if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            console.log("Dữ liệu đội bóng từ API:", data);
            setAvailableTeams(data.teams);
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
                const response = await fetch(`${API_URL}/teams/position?teamId=${selectedTeam}`);
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
                setStandings(data.map((team)=>{
                    const winner = team.posiotion==1 ? 'Có' :'Không';
                    return {
                        ...team,
                        winner: winner,
                    }
                }));
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
        return <div>Đang tải dữ liệu mùa giải...</div>;
    }

    if (error) {
        return <div>Lỗi: {error}</div>;
    }

    const handleRowClick = (seasonId) => {
        console.log(`handleRowClick Season ID: ${seasonId}`); // Debug handleRowClick
        navigate(`/season/${seasonId}`);
    };

    return (
        <div className={styles.standingsContainer}>
            <h2 className={styles.standingsTitle}>Lịch sử giải đấu</h2>
            {availableTeams.length > 0 && (
                <TeamSelector
                    onTeamsChange={handleTeamChange}
                    teams={availableTeams.map(team => ({ id: team.id, name: team.name }))}
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
                            <th onClick={() => requestSort('difference')}>Hiệu số {getSortIndicator('difference')}</th>
                            <th onClick={() => requestSort('point')}>Điểm {getSortIndicator('point')}</th>
                            <th onClick={() => requestSort('posiotion')}>Hạng {getSortIndicator('posiotion')}</th>
                            <th onClick={() => requestSort('winner')}>Vô địch {getSortIndicator('winner')}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {selectedTeam ? (
                            sortedStandings.length > 0 ? (
                                sortedStandings.map((item) => {
                                    console.log("Mùa giải trong map:", item); // Debug object in map
                                    return (
                                        <tr
                                            key={`${item.season}`}
                                            onClick={() => handleRowClick(item.season)}
                                            className={styles.standingsRow}
                                        >
                                            <td>{item.season}</td>
                                            <td>{item.win}</td>
                                            <td>{item.loss}</td>
                                            <td>{item.draw}</td>
                                            <td>{item.difference}</td>
                                            <td>{item.point}</td>
                                            <td>{item.posiotion}</td>
                                            <td>{item.winner}</td>
                                        </tr>
                                    );
                                })
                            ) : loading ? (
                                <tr><td colSpan="8" style={{ textAlign: 'center' }}>Đang tải dữ liệu lịch sử giải...</td></tr>
                            ) : notFound ? (
                                <tr><td colSpan="8" style={{ textAlign: 'center' }}>Không tìm thấy mùa giải nào có đội.</td></tr>
                            ) : error ? (
                                <tr><td colSpan="8" style={{ textAlign: 'center' }}>Lỗi: {error}</td></tr>
                            ) : (
                                <tr><td colSpan="8" style={{ textAlign: 'center' }}>Không tìm thấy mùa giải nào có đội.</td></tr>
                            )
                        ) : (
                            <tr><td colSpan="8" style={{ textAlign: 'center' }}>Vui lòng chọn một đội</td></tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default LookUpSeason;