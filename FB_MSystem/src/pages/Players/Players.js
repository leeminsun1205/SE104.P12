import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import SeasonSelector from '../../components/SeasonSelector/SeasonSelector';
import './Players.css';

const initialPlayers = {
  '2023-2024': {
    1: [
      {
        id: 1,
        name: 'Cầu thủ A1',
        dob: '1999-03-15',
        position: 'Tiền đạo',
        nationality: 'Việt Nam',
        birthplace: 'Hà Nội',
        height: 180,
        weight: 75,
        bio: 'Một tiền đạo tài năng của đội.',
        season: '2023-2024',
      },
      {
        id: 2,
        name: 'Cầu thủ A2',
        dob: '1996-07-10',
        position: 'Tiền vệ',
        nationality: 'Việt Nam',
        birthplace: 'Hồ Chí Minh',
        height: 175,
        weight: 70,
        bio: 'Chơi tốt ở vị trí tiền vệ trung tâm.',
        season: '2023-2024',
      },
    ],
  },
};

const predefinedPositions = ['Tiền đạo', 'Tiền vệ', 'Hậu vệ', 'Thủ môn'];
const seasonsPlayers = Object.keys(initialPlayers);

function calculateAge(dob) {
  const birthDate = new Date(dob);
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
}

function Players() {
  const { teamId } = useParams();
  const navigate = useNavigate();
  const [selectedSeason, setSelectedSeason] = useState(seasonsPlayers[0]);
  const [players, setPlayers] = useState(initialPlayers);
  const [searchTerm, setSearchTerm] = useState('');
  const [newPlayer, setNewPlayer] = useState({
    name: '',
    position: '',
    dob: '',
    nationality: '',
    birthplace: '',
    height: '',
    weight: '',
    bio: '',
    season: selectedSeason
  });
  const [editPlayer, setEditPlayer] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('add');

  const teamPlayers = (players[selectedSeason]?.[teamId]) || [];
  const filteredPlayers = teamPlayers.filter(player =>
    player.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const openModal = (type, player = null) => {
    setModalType(type);
    setShowModal(true);
    if (type === 'edit' && player) setEditPlayer(player);
  };

  const closeModal = () => {
    setShowModal(false);
    setNewPlayer({
      name: '',
      position: '',
      dob: '',
      nationality: '',
      birthplace: '',
      height: '',
      weight: '',
      bio: '',
      season: selectedSeason
    });
    setEditPlayer(null);
  };

  const handleAddPlayer = () => {
    if (newPlayer.name && newPlayer.position && newPlayer.dob) {
      const updatedPlayers = [
        ...teamPlayers,
        { id: Date.now(), ...newPlayer, season: selectedSeason },
      ];
      setPlayers({
        ...players,
        [selectedSeason]: { ...players[selectedSeason], [teamId]: updatedPlayers },
      });
      closeModal();
    }
  };

  const handleUpdatePlayer = () => {
    const updatedPlayers = teamPlayers.map(player =>
      player.id === editPlayer.id ? editPlayer : player
    );
    setPlayers({
      ...players,
      [selectedSeason]: { ...players[selectedSeason], [teamId]: updatedPlayers },
    });
    closeModal();
  };

  const handleDeletePlayer = (playerId) => {
    const updatedPlayers = teamPlayers.filter(player => player.id !== playerId);
    setPlayers({
      ...players,
      [selectedSeason]: { ...players[selectedSeason], [teamId]: updatedPlayers },
    });
  };

  const clearSearch = () => setSearchTerm('');

  return (
    <div className="players-container">
      <div className="header-container">
        <button onClick={() => navigate('/teams')} className="back-to-teams">
          Quay lại
        </button>
        <h2>Quản lý cầu thủ</h2>
      </div>
      <SeasonSelector
        seasons={seasonsPlayers}
        selectedSeason={selectedSeason}
        onSeasonChange={setSelectedSeason}
      />
      <div className="search-container">
        <div className="search-input-wrapper">
          <input
            type="text"
            placeholder="Tìm kiếm cầu thủ..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {searchTerm && (
            <button className="clear-search" onClick={clearSearch}>
              &#x2715;
            </button>
          )}
        </div>
      </div>
      <button onClick={() => openModal('add')} className="add-player">
        Thêm cầu thủ
      </button>
      <ul className="player-list">
        {filteredPlayers.length > 0 ? (
          filteredPlayers.map(player => (
            <li key={player.id} className="player-card">
              <div className="player-details">
                <h3>{player.name}</h3>
                <p>Năm sinh: {player.dob} (Tuổi: {calculateAge(player.dob)})</p>
                <p>Quốc tịch: {player.nationality}</p>
                <p>Vị trí: {player.position}</p>
              </div>
              <div className="action">
                <button onClick={() => openModal('edit', player)} className="edit-player">Chỉnh sửa</button>
                <button onClick={() => handleDeletePlayer(player.id)} className="delete-player">Xóa</button>
              </div>
            </li>
          ))
        ) : (
          <div className="empty-state">
            <p>Không tìm thấy cầu thủ nào. Hãy thử tìm kiếm với từ khóa khác.</p>
          </div>
        )}
      </ul>
      {showModal && (
        <div className="modal">
          <div className="modal-content">
            <h3>{modalType === 'add' ? 'Thêm cầu thủ mới' : 'Chỉnh sửa cầu thủ'}</h3>
            <input
              type="text"
              placeholder="Tên cầu thủ"
              value={modalType === 'add' ? newPlayer.name : editPlayer?.name || ''}
              onChange={(e) =>
                modalType === 'add'
                  ? setNewPlayer({ ...newPlayer, name: e.target.value })
                  : setEditPlayer({ ...editPlayer, name: e.target.value })
              }
            />
            <select
              value={modalType === 'add' ? newPlayer.position : editPlayer?.position || ''}
              onChange={(e) =>
                modalType === 'add'
                  ? setNewPlayer({ ...newPlayer, position: e.target.value })
                  : setEditPlayer({ ...editPlayer, position: e.target.value })
              }
            >
              <option value="" disabled>Chọn vị trí</option>
              {predefinedPositions.map((position) => (
                <option key={position} value={position}>{position}</option>
              ))}
            </select>
            <input
              type="date"
              placeholder="Ngày sinh"
              value={modalType === 'add' ? newPlayer.dob : editPlayer?.dob || ''}
              onChange={(e) =>
                modalType === 'add'
                  ? setNewPlayer({ ...newPlayer, dob: e.target.value })
                  : setEditPlayer({ ...editPlayer, dob: e.target.value })
              }
            />
            <input
              type="text"
              placeholder="Quốc tịch"
              value={modalType === 'add' ? newPlayer.nationality : editPlayer?.nationality || ''}
              onChange={(e) =>
                modalType === 'add'
                  ?
                  setNewPlayer({ ...newPlayer, nationality: e.target.value })
                  : setEditPlayer({ ...editPlayer, nationality: e.target.value })
              }
            />
            <input
              type="text"
              placeholder="Nơi sinh"
              value={modalType === 'add' ? newPlayer.birthplace : editPlayer?.birthplace || ''}
              onChange={(e) =>
                modalType === 'add'
                  ? setNewPlayer({ ...newPlayer, birthplace: e.target.value })
                  : setEditPlayer({ ...editPlayer, birthplace: e.target.value })
              }
            />
            <input
              type="number"
              placeholder="Chiều cao (cm)"
              value={modalType === 'add' ? newPlayer.height : editPlayer?.height || ''}
              onChange={(e) =>
                modalType === 'add'
                  ? setNewPlayer({ ...newPlayer, height: e.target.value })
                  : setEditPlayer({ ...editPlayer, height: e.target.value })
              }
            />
            <input
              type="number"
              placeholder="Cân nặng (kg)"
              value={modalType === 'add' ? newPlayer.weight : editPlayer?.weight || ''}
              onChange={(e) =>
                modalType === 'add'
                  ? setNewPlayer({ ...newPlayer, weight: e.target.value })
                  : setEditPlayer({ ...editPlayer, weight: e.target.value })
              }
            />
            <textarea
              placeholder="Tiểu sử"
              value={modalType === 'add' ? newPlayer.bio : editPlayer?.bio || ''}
              onChange={(e) =>
                modalType === 'add'
                  ? setNewPlayer({ ...newPlayer, bio: e.target.value })
                  : setEditPlayer({ ...editPlayer, bio: e.target.value })
              }
            />
            <div className="modal-actions">
              <button
                onClick={modalType === 'add' ? handleAddPlayer : handleUpdatePlayer}
              >
                {modalType === 'add' ? 'Thêm' : 'Cập nhật'}
              </button>
              <button onClick={closeModal}>Hủy</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Players;
