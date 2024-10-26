import React from 'react';
import { Link } from 'react-router-dom';

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
            <Link to={`/teams/${team.id}/players`}>Xem cầu thủ</Link> {/* Liên kết đến trang cầu thủ */}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Teams;
