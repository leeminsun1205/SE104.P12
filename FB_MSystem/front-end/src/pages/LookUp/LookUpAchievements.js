import React, { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import TeamSelector from "../../components/TeamSelector.js/TeamSelector";
import styles from "./LookUpAchievements.module.css";

function LookUpAchievements({ API_URL }) {
    const navigate = useNavigate();
    const [selectedTeam, setSelectedTeam] = useState("");
    const [availableTeams, setAvailableTeams] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [notFound, setNotFound] = useState(false);
    const [achievements, setAchievements] = useState([]);
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
            setAchievements([]);
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
                        setAchievements([]);
                    } else {
                        throw new Error(`HTTP error! status: ${response.status}`);
                    }
                    return;
                }
                const data = await response.json();
                console.log("Dữ liệu giải đấu từ API:", data); // Debug API response
                const result = data.filter(team => team.posiotion === 1);
                const seasonsWinner = result.map(team => team.season);
                setAchievements(seasonsWinner);
            } catch (error) {
                console.error("Lỗi khi fetch dữ liệu giải đấu:", error);
                setError("Failed to load standings.");
                setAchievements([]);
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

    const sortedAchievements = useMemo(() => {
        const sortableAchievements = [...achievements];
        if (sortConfig.key !== null) {
            sortableAchievements.sort((a, b) => {
                if (a < b) {
                    return sortConfig.direction === 'ascending' ? -1 : 1;
                }
                if (a > b) {
                    return sortConfig.direction === 'ascending' ? 1 : -1;
                }
                return 0;
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

    const handleRowClick = (seasonId) => {
        console.log(`handleRowClick Season ID: ${seasonId}`); // Debug handleRowClick
        // Assuming you want to navigate to the season details page
        navigate(`/season/${seasonId}`);
    };

    return (
        <div className={styles.standingsContainer}>
            <h2 className={styles.standingsTitle}>Thành tích</h2>
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
                        </tr>
                    </thead>
                    <tbody>
                        {selectedTeam ? (
                            sortedAchievements.length > 0 ? (
                                sortedAchievements.map((season) => {
                                    console.log("Mùa giải trong map:", season); // Debug object in map
                                    return (
                                        <tr
                                            key={season}
                                            onClick={() => handleRowClick(season)}
                                            className={styles.standingsRow}
                                        >
                                            <td>{season}</td>
                                        </tr>
                                    );
                                })
                            ) : loading ? (
                                <tr><td colSpan="1" style={{ textAlign: 'center' }}>Đang tải dữ liệu thành tích...</td></tr>
                            ) : notFound ? (
                                <tr><td colSpan="1" style={{ textAlign: 'center' }}>Không tìm thấy thành tích nào cho đội này.</td></tr>
                            ) : error ? (
                                <tr><td colSpan="1" style={{ textAlign: 'center' }}>Lỗi: {error}</td></tr>
                            ) : (
                                <tr><td colSpan="1" style={{ textAlign: 'center' }}>Không có dữ liệu thành tích.</td></tr>
                            )
                        ) : (
                            <tr><td colSpan="1" style={{ textAlign: 'center' }}>Vui lòng chọn một đội</td></tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default LookUpAchievements;