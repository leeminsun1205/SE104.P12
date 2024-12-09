import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Teams.css';

function AddTeam({ onAddTeam }) {
  const [team, setTeam] = useState({ name: '', city: '' });
  const navigate = useNavigate();

  const handleAdd = () => {
    if (team.name && team.city) {
      onAddTeam({ ...team, id: Date.now() });
      navigate('/teams/');
    }
  };

  return (
    <div className="form-container">
      <h2>Thêm đội bóng mới</h2>
      <input
        type="text"
        placeholder="Tên đội bóng"
        value={team.name}
        onChange={(e) => setTeam({ ...team, name: e.target.value })}
      />
      <input
        type="text"
        placeholder="Thành phố"
        value={team.city}
        onChange={(e) => setTeam({ ...team, city: e.target.value })}
      />
      <div>
        <button className="add" onClick={handleAdd}>Thêm</button>
        <button className="cancel" onClick={() => navigate('/teams/')}>Hủy</button>
      </div>
    </div>
  );
}

export default AddTeam;
