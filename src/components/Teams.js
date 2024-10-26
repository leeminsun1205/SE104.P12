// src/components/Teams.js
import React from 'react';

const teams = [
  { id: 1, name: 'Team A', city: 'Hanoi' },
  { id: 2, name: 'Team B', city: 'Ho Chi Minh' },
  { id: 3, name: 'Team C', city: 'Da Nang' },
];

function Teams() {
  return (
    <div className="teams">
      <h2>Danh sách đội bóng</h2>
      <ul>
        {teams.map(team => (
          <li key={team.id}>
            <h3>{team.name}</h3>
            <p>Thành phố: {team.city}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Teams;
