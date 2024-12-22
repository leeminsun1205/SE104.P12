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
          <p className="player-info">Position: {player.position}</p>
          <p className="player-info">Nationality: {player.nationality}</p>
          {/* Add other player information as needed */}
          <div className="player-actions">
            <button className="delete" onClick={() => onDelete(player.id)}>
              Delete
            </button>
            <button className="navigate" onClick={() => onNavigate(player)}>
              View Details
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
}

export default PlayerList;