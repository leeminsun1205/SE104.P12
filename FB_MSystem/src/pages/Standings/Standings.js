// src/components/Standings.js
import React from 'react';
import styles from './Standings.module.css';

function Standings() {
  const teams = [
    { rank: 1, name: 'Team A', played: 10, won: 8, drawn: 1, lost: 1, points: 25 },
    { rank: 2, name: 'Team B', played: 10, won: 7, drawn: 2, lost: 1, points: 23 },
    { rank: 3, name: 'Team C', played: 10, won: 6, drawn: 2, lost: 2, points: 20 },
    { rank: 4, name: 'Team D', played: 10, won: 5, drawn: 3, lost: 2, points: 18 },
    { rank: 5, name: 'Team E', played: 10, won: 4, drawn: 2, lost: 4, points: 14 },
    { rank: 6, name: 'Team F', played: 10, won: 3, drawn: 2, lost: 5, points: 11 },
  ];

  return (
    <div className={styles.standingsContainer}>
      <h2 className={styles.standingsTitle}>League Standings</h2>
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
            {teams.map((team, index) => (
              <tr key={`${team.rank}-${team.name}`}>
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
