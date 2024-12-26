// --- START OF FILE TopScorers.js ---

import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styles from './TopScorers.module.css';

function TopScorers({ API_URL }) {
    const { seasonId } = useParams();
    const navigate = useNavigate();
    const [topScorers, setTopScorers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [teams, setTeams] = useState({});
    const [players, setPlayers] = useState({}); // To store player names
    const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' });

    useEffect(() => {
        const fetchSeasonTeams = async () => {
            try {
                const response = await fetch(`${API_URL}/teams?season=${seasonId}`);
                if (!response.ok) {
                    throw new Error(`Could not fetch teams for season: ${response.status}`);
                }
                const data = await response.json();
                const teamsMap = {};
                data.teams.forEach(team => {
                    teamsMap[team.id] = team.name;
                });
                setTeams(teamsMap);
            } catch (error) {
                console.error("Error fetching teams:", error);
                setError(error);
            }
        };

        fetchSeasonTeams();
    }, [API_URL, seasonId]);

    useEffect(() => {
        const fetchSeasonPlayers = async () => {
            try {
                const response = await fetch(`${API_URL}/players?season=${seasonId}`);
                if (!response.ok) {
                    const message = `Could not fetch players for season: ${response.status} - ${response.statusText}`;
                    throw new Error(message);
                }
                const data = await response.json();
                console.log("Players API Response:", data);
    
                // Directly process the array of players
                if (Array.isArray(data)) {
                    const playersMap = {};
                    data.forEach(player => {
                        playersMap[player.id] = player.name;
                    });
                    setPlayers(playersMap);
                } else {
                    console.error("API response for players is not an array:", data);
                    setError("Invalid player data format.");
                }
            } catch (error) {
                console.error("Error fetching players:", error);
                setError("Failed to load player data.");
            }
        };
    
        fetchSeasonPlayers();
    }, [API_URL, seasonId]);

    useEffect(() => {
        const fetchTopScorers = async () => {
            setLoading(true);
            setError(null);
            try {
                const response = await fetch(`${API_URL}/matches?season=${seasonId}`);
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();
                processMatchData(data);
            } catch (e) {
                setError(e);
            } finally {
                setLoading(false);
            }
        };

        const processMatchData = (matches) => {
            const playerGoals = {};
            matches.forEach(match => {
                if (match.goals) {
                    match.goals.forEach(goal => {
                        const playerId = goal.player; // Assuming goal.player is the player ID
                        const teamId = goal.teamId;
                        playerGoals[playerId] = {
                            goals: (playerGoals[playerId]?.goals || 0) + 1,
                            teamId: teamId
                        };
                    });
                }
            });

            const scorersArray = Object.entries(playerGoals)
                .map(([playerId, data]) => ({ playerId: parseInt(playerId), goals: data.goals, teamId: data.teamId }))
                .sort((a, b) => b.goals - a.goals);

            setTopScorers(scorersArray);
        };

        fetchTopScorers();
    }, [API_URL, seasonId]);

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
            <h2 className={styles.title}>Vua phá lưới - Mùa giải {seasonId}</h2>
            {sortedTopScorers.length > 0 ? (
                <table className={styles.scorersTable}>
                    <thead>
                        <tr>
                            <th>Hạng</th>
                            <th onClick={() => requestSort('playerId')}> {/* Sort by playerId */}
                                Cầu thủ {getSortIndicator('playerId')}
                            </th>
                            <th onClick={() => requestSort('teamId')}>
                                Đội {getSortIndicator('teamId')}
                            </th>
                            <th onClick={() => requestSort('goals')}>
                                Số bàn thắng {getSortIndicator('goals')}
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {sortedTopScorers.map((scorer, index) => (
                            <tr key={index}>
                                <td>{index + 1}</td>
                                <td>{players[scorer.playerId] || 'Unknown Player'}</td> {/* Display player name */}
                                <td>{teams[scorer.teamId] || 'Unknown Team'}</td>
                                <td>{scorer.goals}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : (
                <p>Không có bàn thắng nào được ghi trong mùa giải này.</p>
            )}
            <button className={styles.backButton} onClick={() => navigate(`/seasons/${seasonId}`)}>
                Quay lại thông tin mùa giải
            </button>
        </div>
    );
}

export default TopScorers;  