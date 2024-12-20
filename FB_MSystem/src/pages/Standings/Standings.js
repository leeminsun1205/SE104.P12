import React, { useState } from 'react';
import styles from './Standings.module.css';
import SeasonSelector from '../../components/SeasonSelector/SeasonSelector';

const allTeams = [
    { rank: 1, name: 'Team A', played: 10, won: 8, drawn: 1, lost: 1, season: '2023-2024' },
    { rank: 2, name: 'Team B', played: 10, won: 7, drawn: 2, lost: 1, season: '2023-2024' },
    { rank: 3, name: 'Team C', played: 10, won: 6, drawn: 2, lost: 2, season: '2022-2023' },
];

const seasonsStandings = [...new Set(allTeams.map(team => team.season))];

function Standings() {
    const [selectedSeason, setSelectedSeason] = useState(seasonsStandings[0]);
    const teams = allTeams.filter(team => team.season === selectedSeason);

    const teamsWithPoints = teams.map((team) => ({
        ...team,
        points: team.won * 3 + team.drawn,
    }));

    return (
        <div className={styles.standingsContainer}>
            <h2 className={styles.standingsTitle}>League Standings</h2>
            <SeasonSelector onSeasonChange={setSelectedSeason} seasons={seasonsStandings} selectedSeason={selectedSeason}/>
            <div className={styles.tableWrapper}>
                <table className={styles.standingsTable}>
                    <thead>
                        <tr>
                            <th>Rank</th>
                            <th>Team</th>
                            <th>Played</th>
                            <th>Won</th>
                            <th>Drawn</th>
                            <th>Lost</th>
                            <th>Points</th>
                        </tr>
                    </thead>
                    <tbody>
                        {teamsWithPoints.map((team) => (
                            <tr key={`${team.rank}-${team.name}-${team.season}`}> {/* Added season to the key */}
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
        </div>
    );
}

export default Standings;