import React, { useState, useEffect } from 'react';
import styles from './Standings.module.css';
import SeasonSelector from '../../components/SeasonSelector/SeasonSelector';

function Standings({API_URL}) {
    const [selectedSeason, setSelectedSeason] = useState('');
    const [standings, setStandings] = useState([]);
    const [seasonsStandings, setSeasonsStandings] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchSeasons = async () => {
            try {
                const response = await fetch(`${API_URL}/seasons`);
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();
                setSeasonsStandings(data.seasons.filter(season => season !== 'all'));
            } catch (error) {
                console.error("Error fetching seasons:", error);
                setError("Failed to load seasons.");
            }
        };

        fetchSeasons();
    }, []);

    useEffect(() => {
        if (!selectedSeason) return;

        const fetchStandings = async () => {
            setLoading(true);
            setError(null);
            try {
                const response = await fetch(`${API_URL}/standings?season=${selectedSeason}`);
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();
                setStandings(data);
            } catch (error) {
                console.error("Error fetching standings:", error);
                setError("Failed to load standings for the selected season.");
                setStandings([]);
            } finally {
                setLoading(false);
            }
        };

        fetchStandings();
    }, [selectedSeason]);

    const handleSeasonChange = (season) => {
        setSelectedSeason(season);
    };

    if (loading) {
        return <div>Đang tải dữ liệu bảng xếp hạng...</div>;
    }

    if (error) {
        return <div>Lỗi: {error}</div>;
    }

    return (
        <div className={styles.standingsContainer}>
            <h2 className={styles.standingsTitle}>Bảng xếp hạng</h2>
            {seasonsStandings.length > 0 && (
                <SeasonSelector
                    onSeasonChange={handleSeasonChange}
                    seasons={seasonsStandings}
                    selectedSeason={selectedSeason}
                />
            )}
            {selectedSeason && (
                standings.length > 0 ? (
                    <div className={styles.tableWrapper}>
                        <table className={styles.standingsTable}>
                            <thead>
                                <tr>
                                    <th>Hạng</th>
                                    <th>Đội</th>
                                    <th>Trận</th>
                                    <th>Thắng</th>
                                    <th>Hòa</th>
                                    <th>Thua</th>
                                    <th>Điểm</th>
                                </tr>
                            </thead>
                            <tbody>
                                {standings.map((team) => (
                                    <tr key={`${team.rank}-${team.name}-${team.season}`}>
                                        <td>{team.rank}</td>
                                        <td className={styles.teamName}>{team.name}</td>
                                        <td>{team.played}</td>
                                        <td>{team.won}</td>
                                        <td>{team.drawn}</td>
                                        <td>{team.lost}</td>
                                        <td className={styles.points}>{team.points}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <p>Không tìm thấy bảng xếp hạng cho mùa giải này.</p>
                )
            )}
        </div>
    );
}

export default Standings;