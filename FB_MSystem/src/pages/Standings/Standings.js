// src/components/Standings.js
import React from 'react';
import './Standings.module.css';

function Standings() {
  const teams = [
    { rank: 1, name: 'Team A', played: 10, won: 8, drawn: 1, lost: 1, points: 25 },
    { rank: 2, name: 'Team B', played: 10, won: 7, drawn: 2, lost: 1, points: 23 },
    // Thêm các đội khác vào đây
  ];

  return (
    <div className="standings-container">
      <h2 className="standings-title">League Standings</h2>
      <table className="standings-table">
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
          {teams.map((team) => (
            <tr key={team.rank}>
              <td>{team.rank}</td>
              <td className="team-name">{team.name}</td>
              <td>{team.played}</td>
              <td>{team.won}</td>
              <td>{team.drawn}</td>
              <td>{team.lost}</td>
              <td className="points">{team.points}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Standings;
