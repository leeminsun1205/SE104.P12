// src/components/Standings.js
import React from 'react';

const standings = [
  { id: 1, team: 'Team A', played: 10, points: 25 },
  { id: 2, team: 'Team B', played: 10, points: 20 },
  { id: 3, team: 'Team C', played: 10, points: 18 },
];

function Standings() {
  return (
    <div className="standings">
      <h2>Bảng xếp hạng</h2>
      <table>
        <thead>
          <tr>
            <th>Thứ hạng</th>
            <th>Đội bóng</th>
            <th>Số trận đã đấu</th>
            <th>Điểm</th>
          </tr>
        </thead>
        <tbody>
          {standings.map((team, index) => (
            <tr key={team.id}>
              <td>{index + 1}</td>
              <td>{team.team}</td>
              <td>{team.played}</td>
              <td>{team.points}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Standings;
