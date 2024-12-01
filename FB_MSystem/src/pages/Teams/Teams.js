import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Team.css';

const initialTeams = [
  { id: 1, name: 'Team A', city: 'Hanoi' },
  { id: 2, name: 'Team B', city: 'Ho Chi Minh' },
  { id: 3, name: 'Team C', city: 'Da Nang' },
];

function Teams() {
  const [teams, setTeams] = useState(initialTeams);
  const [searchTerm, setSearchTerm] = useState('');
  const [newTeam, setNewTeam] = useState({ name: '', city: '' });
  const [editTeam, setEditTeam] = useState(null); // Để chỉnh sửa đội bóng
  const [deletedTeam, setDeletedTeam] = useState(null); // Lưu đội bóng đã xóa để undo

  // Hàm lọc danh sách đội bóng dựa trên từ khóa
  const filteredTeams = teams.filter(team =>
    team.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Thêm đội bóng mới
  const handleAddTeam = () => {
    if (newTeam.name && newTeam.city) {
      setTeams([...teams, { id: Date.now(), name: newTeam.name, city: newTeam.city }]);
      setNewTeam({ name: '', city: '' });
    }
  };

  // Xóa đội bóng
  const handleDeleteTeam = (id) => {
    const teamToDelete = teams.find(team => team.id === id);
    setDeletedTeam(teamToDelete); // Lưu đội bóng bị xóa để undo
    setTeams(teams.filter(team => team.id !== id));
  };

  // Hoàn tác xóa đội bóng
  const handleUndoDelete = () => {
    if (deletedTeam) {
      setTeams([...teams, deletedTeam]);
      setDeletedTeam(null); // Xóa đội bóng đã lưu để tránh hoàn tác lại nhiều lần
    }
  };

  // Cập nhật đội bóng sau khi chỉnh sửa
  const handleUpdateTeam = () => {
    setTeams(teams.map(team => (team.id === editTeam.id ? editTeam : team)));
    setEditTeam(null); // Xóa trạng thái chỉnh sửa
  };

  return (
    <div className="teams">
      <h2>Danh sách đội bóng</h2>
      
      {/* Thanh tìm kiếm */}
      <input
        type="text"
        placeholder="Tìm kiếm đội bóng..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        style={{
          padding: '10px',
          width: '100%',
          marginBottom: '20px',
          borderRadius: '5px',
          border: '1px solid #ddd'
        }}
      />

      {/* Thêm đội bóng mới */}
      <div class='input'>
        <input
          type="text"
          placeholder="Tên đội bóng"
          value={newTeam.name}
          onChange={(e) => setNewTeam({ ...newTeam, name: e.target.value })}
        />
        <input
          type="text"
          placeholder="Thành phố"
          value={newTeam.city}
          onChange={(e) => setNewTeam({ ...newTeam, city: e.target.value })}
        />
        <button onClick={handleAddTeam}>Thêm đội bóng</button>
      </div>

      {/* Danh sách đội bóng đã lọc */}
      <ul>
        {filteredTeams.length > 0 ? (
          filteredTeams.map(team => (
            <li key={team.id}>
              {editTeam && editTeam.id === team.id ? (
                // Chế độ chỉnh sửa
                <div>
                  <input
                    type="text"
                    value={editTeam.name}
                    onChange={(e) => setEditTeam({ ...editTeam, name: e.target.value })}
                  />
                  <input
                    type="text"
                    value={editTeam.city}
                    onChange={(e) => setEditTeam({ ...editTeam, city: e.target.value })}
                  />
                  <button onClick={handleUpdateTeam}>Lưu</button>
                  <button onClick={() => setEditTeam(null)}>Hủy</button>
                </div>
              ) : (
                // Chế độ hiển thị thông thường
                <div>
                  <h3>{team.name}</h3>
                  <p>Thành phố: {team.city}</p>
                  <Link to={`/teams/${team.id}/players`}>Xem cầu thủ</Link>
                  <button onClick={() => setEditTeam(team)}>Sửa</button>
                  <button onClick={() => handleDeleteTeam(team.id)}>Xóa</button>
                </div>
              )}
            </li>
          ))
        ) : (
          <p>Không tìm thấy đội bóng nào.</p>
        )}
      </ul>

      {/* Nút Hoàn tác Xóa */}
      {deletedTeam && (
        <button onClick={handleUndoDelete} style={{ color: 'red', marginTop: '10px' }}>
          Hoàn tác xóa
        </button>
      )}
    </div>
  );
}

export default Teams;
