// /src/pages/TopScorers/TopScorers.js
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styles from './TopScorers.module.css';

function TopScorers({ API_URL }) {
    const { seasonId } = useParams();
    const navigate = useNavigate();
    const [topScorers, setTopScorers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [teams, setTeams] = useState({}); // To store team names by ID

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
                        const playerName = goal.player;
                        const teamId = goal.teamId; 
                        playerGoals[playerName] = {
                            goals: (playerGoals[playerName]?.goals || 0) + 1,
                            teamId: teamId
                        };
                    });
                }
            });

            const scorersArray = Object.entries(playerGoals)
                .map(([playerName, data]) => ({ playerName, goals: data.goals, teamId: data.teamId }))
                .sort((a, b) => b.goals - a.goals);

            setTopScorers(scorersArray);
        };

        fetchTopScorers();
    }, [API_URL, seasonId]);

    if (loading) {
        return <div>Đang tải danh sách vua phá lưới...</div>;
    }

    if (error) {
        return <div>Lỗi khi tải dữ liệu: {error.message}</div>;
    }

    return (
        <div className={styles.topScorersPage}>
            <h2 className={styles.title}>Vua phá lưới - Mùa giải {seasonId}</h2>
            {topScorers.length > 0 ? (
                <table className={styles.scorersTable}>
                    <thead>
                        <tr>
                            <th>Hạng</th>
                            <th>Cầu thủ</th>
                            <th>Đội</th>
                            <th>Số bàn thắng</th>
                        </tr>
                    </thead>
                    <tbody>
                        {topScorers.map((scorer, index) => (
                            <tr key={index}>
                                <td>{index + 1}</td>
                                <td>{scorer.playerName}</td>
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