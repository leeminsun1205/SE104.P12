// src/components/Matches.js
import React from 'react';

const matches = [
  { id: 1, homeTeam: 'Team A', awayTeam: 'Team B', date: '2024-01-15', time: '18:00' },
  { id: 2, homeTeam: 'Team C', awayTeam: 'Team A', date: '2024-01-17', time: '20:00' },
  { id: 3, homeTeam: 'Team B', awayTeam: 'Team C', date: '2024-01-20', time: '19:00' },
];

function Matches() {
  return (
    <div className="matches">
      <h2>Danh sách trận đấu</h2>
      <ul>
        {matches.map(match => (
          <li key={match.id}>
            <p>{match.homeTeam} vs {match.awayTeam}</p>
            <p>Ngày: {match.date}, Giờ: {match.time}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Matches;
