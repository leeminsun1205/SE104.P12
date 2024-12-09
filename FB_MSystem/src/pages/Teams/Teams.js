import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Teams.css';

function Teams({ teams, onDeleteTeam }) {
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  const filteredTeams = teams.filter((team) =>
    team.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDelete = (id) => {
    const confirmDelete = window.confirm('Bạn có chắc chắn muốn xóa đội bóng này?');
    if (confirmDelete) {
      onDeleteTeam(id);
    }
  };

  const handleEdit = (id) => {
    navigate(`/teams/edit/${id}`);
  };

  return (
    <div className="teams">
      <h2>Danh sách đội bóng</h2>
      <input
        type="text"
        placeholder="Tìm kiếm đội bóng..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <button className ="add-button" onClick={() => navigate('/teams/add')}>Thêm đội bóng mới</button>
      <ul>
        {filteredTeams.length > 0 ? (
          filteredTeams.map((team) => (
            <li key={team.id}>
              <h3>{team.name}</h3>
              <p>Thành phố: {team.city}</p>
              <div className="actions">
                <button className="edit" onClick={() => handleEdit(team.id)}>Sửa</button>
                <button className="delete" onClick={() => handleDelete(team.id)}>Xóa</button>
              </div>
            </li>
          ))
        ) : (
          <p>Không tìm thấy đội bóng nào.</p>
        )}
      </ul>
    </div>
  );
}

export default Teams;
