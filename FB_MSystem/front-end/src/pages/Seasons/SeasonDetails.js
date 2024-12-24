import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import styles from './SeasonDetails.module.css';

function SeasonDetails({ API_URL }) {
    const { seasonId } = useParams();
    const [season, setSeason] = useState(null);
    const [teams, setTeams] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchSeasonDetails = async () => {
            setLoading(true);
            setError(null);
            try {
                const response = await fetch(`${API_URL}/seasons/${seasonId}`);
                if (!response.ok) {
                    const text = await response.text(); // Get the raw response text
                    console.error("HTTP Error fetching season:", response.status, response.statusText);
                    console.error("Response Body:", text);
                    throw new Error(`Could not fetch season details: ${response.status} - ${response.statusText}`);
                }
                const data = await response.json();
                setSeason(data);
            } catch (err) {
                console.error("Error fetching season details:", err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
    
        fetchSeasonDetails();
    }, [API_URL, seasonId]);

    useEffect(() => {
        const fetchTeamsDetails = async () => {
            if (season && season.teams && season.teams.length > 0) {
                const teamsPromises = season.teams.map(teamId =>
                    fetch(`${API_URL}/teams/${teamId}`).then(res => {
                        if (!res.ok) {
                            throw new Error(`Could not fetch team details for ID ${teamId}: ${res.status}`);
                        }
                        return res.json();
                    })
                );

                try {
                    const teamsData = await Promise.all(teamsPromises);
                    console.log("Teams data received:", teamsData); // Thêm dòng này
                    setTeams(teamsData);
                } catch (error) {
                    console.error("Error fetching team details:", error); // Giữ lại dòng này
                    setError(error.message);
                }
            }
        };

        fetchTeamsDetails();
    }, [API_URL, season]);

    if (loading) {
        return <div className="container">Loading season details...</div>;
    }

    if (error) {
        return <div className="container error">Error: {error}</div>;
    }

    if (!season) {
        return <div className="container">Season not found.</div>;
    }

    return (
        <div className={styles.container}>
            <h2 className={styles.title}>{season.name}</h2>
            <p className={styles.paragraph}>Mã mùa giải: {season.id}</p>
            <p className={styles.paragraph}>Ngày bắt đầu: {new Date(season.startDate).toLocaleDateString()}</p>
            <p className={styles.paragraph}>Ngày kết thúc: {new Date(season.endDate).toLocaleDateString()}</p>
            {teams.length > 0 ? (
                <div>
                    <h3 className={styles.title} style={{ fontSize: '20px' }}>Các đội tham gia:</h3>
                    <ul className={styles.list}>
                        {teams.map(team => (
                            <li key={team.id} className={styles['list-item']}>
                                <Link to={`/teams/${team.id}`} className={styles.teamLink}>
                                    {team.name}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>
            ) : (
                <p className={styles.paragraph}>Không có đội nào tham gia mùa giải này.</p>
            )}
        </div>
    );
}

export default SeasonDetails;