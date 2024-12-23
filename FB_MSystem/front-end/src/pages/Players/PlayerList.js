import React from 'react';
import { Link, NavLink } from 'react-router-dom';

export const calculateAge = (dob) => {
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }
    return age;
};

function PlayerList({ players, onDelete, onNavigate, season }) {
  return (
    <ul className="player-list">
      {players.map((player) => (
        <li key={player.id} className="player-item">
          <h3 className="player-name">
            <Link to={`/teams/${player.teamId}/players/${player.id}`} state={{ player }}>
              {player.name}
            </Link>
          </h3>
          <p className="player-info">Vị trí: {player.position}</p>
          <p className="player-info">Quốc tịch: {player.nationality}</p>
          <div className="player-actions">
            <button className="delete" onClick={() => onDelete(player.id)}>
              Xóa
            </button>
            <button className="navigate" onClick={() => onNavigate(player)}>
              Xem chi tiết
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
}

export default PlayerList;