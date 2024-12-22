import React from 'react';
const calculateAge = (dob) => {
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };
  
const PlayerList = ({ players, onEdit, onDelete, onNavigate , season    }) => {
  if (players.length === 0) {
    return <p>Không tìm thấy cầu thủ nào.</p>;
  }

  return (
    <ul className="player-list">
      {players.map((player) => (
        <li key={player.id} className="player-card">
          <div onClick={() => onNavigate(player.id)}>
            <h3>{player.name}</h3>
            <p>Năm sinh: {player.dob} (Tuổi: {calculateAge(player.dob)})</p>
            <p>Quốc tịch: {player.nationality}</p>
            <p>Vị trí: {player.position}</p>
            <p>Mùa giải: {player.season}</p>
          </div>
          <div className="action">
            <button onClick={() => onEdit(player)} className="edit-player">Chỉnh sửa</button>
            <button onClick={() => onDelete(player.id)} className="delete-player">Xóa</button>
          </div>
        </li>
      ))}
    </ul>
  );
};

export default PlayerList;
