import React, { useState, useMemo, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
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
        if (!setSelectedTeam) {
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
                // Lọc các phần tử có posiotion = 1
                const result = data.filter(team => team.posiotion === 1);

                // Liệt kê tên các phần tử
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
    }, [selectedTeam]);

    const handleTeamChange = (team) => {
        console.log("Đội được chọn:", team); // Debug team selection
        setSelectedTeam(season);
    };

    const handleRowClick = (seasonId, teamId) => {
        console.log(`handleRowClick Season ID: ${seasonId}, - Team ID: ${teamId}`); // Debug handleRowClick
        navigate(`/teams/${teamId}?season=${seasonId}`);
    };
    return (
        <div className={styles.standingsContainer}>
            <h2 className={styles.standingsTitle}>Thành tích</h2>
            {availableTeams.length > 0 && (
                <TeamSelector
                    onTeamsChange={handleTeamChange}
                    teams={availableTeams.map(teams => ({ id: teams.id, name: teams.name }))}
                    selectedTeam={selectedTeam}
                    id="teams"
                />
            )}

            <div className={styles.tableWrapper}>
                <table className={styles.standingsTable}>
                    <thead>
                        <tr>
                            <th onClick={() => requestSort('season')}>Mùa giải {getSortIndicator('rank')}</th>
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
                                            onClick={() => handleRowClick(item.season, selectedSeason)}
                                            className={styles.standingsRow}
                                        >
                                            <td>{item.season}</td>
                                        </tr>
                                    );
                                })
                            ) : loading ? (
                                <tr><td colSpan="7" style={{ textAlign: 'center' }}>Đang tải dữ liệu lịch sử giải...</td></tr>
                            ) : notFound ? ( // Changed colspan to 9
                                <tr><td colSpan="9" style={{ textAlign: 'center' }}>Không tìm thấy mùa giải nào đội vô địch.</td></tr>
                            ) : error ? (
                                <tr><td colSpan="9" style={{ textAlign: 'center' }}>Lỗi: {error}</td></tr>
                            ) : (
                                <tr><td colSpan="9" style={{ textAlign: 'center' }}>Không tìm thấy mùa giải nào có đội.</td></tr>
                            )
                        ) : (
                            <tr><td colSpan="7" style={{ textAlign: 'center' }}>Vui lòng chọn một đội</td></tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default LookUpAchievements;