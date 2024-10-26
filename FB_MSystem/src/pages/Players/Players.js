import React from 'react';
import { useParams } from 'react-router-dom';

const players = {
  1: [
    { id: 1, name: 'Player A1', position: 'Forward', age: 24 },
    { id: 2, name: 'Player A2', position: 'Midfielder', age: 27 },
  ],
  2: [
    { id: 1, name: 'Player B1', position: 'Defender', age: 22 },
    { id: 2, name: 'Player B2', position: 'Goalkeeper', age: 30 },
  ],
  3: [
    { id: 1, name: 'Player C1', position: 'Forward', age: 25 },
    { id: 2, name: 'Player C2', position: 'Midfielder', age: 28 },
  ],
};

function Player() {
  const { teamId } = useParams(); // Lấy teamId từ URL
  const teamPlayers = players[teamId] || [];

  return (
    <div className="players">
      <h2>Danh sách cầu thủ</h2>
      {teamPlayers.length > 0 ? (
        <ul>
          {teamPlayers.map(player => (
            <li key={player.id}>
              <h3>{player.name}</h3>
              <p>Vị trí: {player.position}</p>
              <p>Tuổi: {player.age}</p>
            </li>
          ))}
        </ul>
      ) : (
        <p>Không có cầu thủ nào trong đội này.</p>
      )}
    </div>
  );
}

export default Player;
