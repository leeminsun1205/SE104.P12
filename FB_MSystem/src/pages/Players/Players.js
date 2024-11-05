import React, { useState } from 'react';
import { useParams } from 'react-router-dom';

const initialPlayers = {
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
  const [players, setPlayers] = useState(initialPlayers);
  const teamPlayers = players[teamId] || [];
  const [searchTerm, setSearchTerm] = useState('');
  const [newPlayer, setNewPlayer] = useState({ name: '', position: '', age: '' });
  const [editPlayer, setEditPlayer] = useState(null); // Lưu cầu thủ đang chỉnh sửa
  const [deletedPlayer, setDeletedPlayer] = useState(null); // Lưu cầu thủ đã xóa để undo

  // Lọc danh sách cầu thủ dựa trên từ khóa tìm kiếm
  const filteredPlayers = teamPlayers.filter(player =>
    player.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Thêm cầu thủ mới
  const handleAddPlayer = () => {
    if (newPlayer.name && newPlayer.position && newPlayer.age) {
      const updatedPlayers = [...teamPlayers, { id: Date.now(), ...newPlayer }];
      setPlayers({ ...players, [teamId]: updatedPlayers });
      setNewPlayer({ name: '', position: '', age: '' });
    }
  };

  // Xóa cầu thủ
  const handleDeletePlayer = (id) => {
    const playerToDelete = teamPlayers.find(player => player.id === id);
    setDeletedPlayer({ ...playerToDelete, teamId }); // Lưu cầu thủ bị xóa để undo
    setPlayers({ ...players, [teamId]: teamPlayers.filter(player => player.id !== id) });
  };

  // Hoàn tác xóa cầu thủ
  const handleUndoDelete = () => {
    if (deletedPlayer) {
      const updatedPlayers = [...players[deletedPlayer.teamId], deletedPlayer];
      setPlayers({ ...players, [deletedPlayer.teamId]: updatedPlayers });
      setDeletedPlayer(null); // Xóa cầu thủ đã lưu để tránh hoàn tác lại nhiều lần
    }
  };

  // Cập nhật cầu thủ sau khi chỉnh sửa
  const handleUpdatePlayer = () => {
    const updatedPlayers = teamPlayers.map(player =>
      player.id === editPlayer.id ? editPlayer : player
    );
    setPlayers({ ...players, [teamId]: updatedPlayers });
    setEditPlayer(null); // Xóa trạng thái chỉnh sửa
  };

  return (
    <div className="players">
      <h2>Danh sách cầu thủ</h2>
      
      {/* Thanh tìm kiếm */}
      <input
        type="text"
        placeholder="Tìm kiếm cầu thủ..."
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

      {/* Thêm cầu thủ mới */}
      <div>
        <input
          type="text"
          placeholder="Tên cầu thủ"
          value={newPlayer.name}
          onChange={(e) => setNewPlayer({ ...newPlayer, name: e.target.value })}
        />
        <input
          type="text"
          placeholder="Vị trí"
          value={newPlayer.position}
          onChange={(e) => setNewPlayer({ ...newPlayer, position: e.target.value })}
        />
        <input
          type="number"
          placeholder="Tuổi"
          value={newPlayer.age}
          onChange={(e) => setNewPlayer({ ...newPlayer, age: parseInt(e.target.value) })}
        />
        <button onClick={handleAddPlayer}>Thêm cầu thủ</button>
      </div>

      {/* Danh sách cầu thủ đã lọc */}
      <ul>
        {filteredPlayers.length > 0 ? (
          filteredPlayers.map(player => (
            <li key={player.id}>
              {editPlayer && editPlayer.id === player.id ? (
                // Chế độ chỉnh sửa
                <div>
                  <input
                    type="text"
                    value={editPlayer.name}
                    onChange={(e) => setEditPlayer({ ...editPlayer, name: e.target.value })}
                  />
                  <input
                    type="text"
                    value={editPlayer.position}
                    onChange={(e) => setEditPlayer({ ...editPlayer, position: e.target.value })}
                  />
                  <input
                    type="number"
                    value={editPlayer.age}
                    onChange={(e) => setEditPlayer({ ...editPlayer, age: parseInt(e.target.value) })}
                  />
                  <button onClick={handleUpdatePlayer}>Lưu</button>
                  <button onClick={() => setEditPlayer(null)}>Hủy</button>
                </div>
              ) : (
                // Chế độ hiển thị thông thường
                <div>
                  <h3>{player.name}</h3>
                  <p>Vị trí: {player.position}</p>
                  <p>Tuổi: {player.age}</p>
                  <button onClick={() => setEditPlayer(player)}>Sửa</button>
                  <button onClick={() => handleDeletePlayer(player.id)}>Xóa</button>
                </div>
              )}
            </li>
          ))
        ) : (
          <p>Không có cầu thủ nào phù hợp với từ khóa tìm kiếm.</p>
        )}
      </ul>

      {/* Nút Hoàn tác Xóa */}
      {deletedPlayer && (
        <button onClick={handleUndoDelete} style={{ color: 'red', marginTop: '10px' }}>
          Hoàn tác xóa
        </button>
      )}
    </div>
  );
}

export default Player;
