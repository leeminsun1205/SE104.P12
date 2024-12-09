import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import './Teams.css';

function EditTeam({ teams, onEditTeam }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [team, setTeam] = useState(null);

  useEffect(() => {
    const teamToEdit = teams.find((t) => t.id === parseInt(id, 10));
    if (teamToEdit) setTeam(teamToEdit);
  }, [id, teams]);

  const handleSave = () => {
    if (team.name && team.city) {
      onEditTeam(team);
      navigate('/teams/');
    }
  };

  if (!team) return <p>Đội bóng không tồn tại!</p>;

  return (
    <div className="form-container">
      <h2>Chỉnh sửa đội bóng</h2>
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
        <button className="save" onClick={handleSave}>Lưu</button>
        <button className="cancel" onClick={() => navigate('/teams/')}>Hủy</button>
      </div>
    </div>
  );
}

export default EditTeam;
