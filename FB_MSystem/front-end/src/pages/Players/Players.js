import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import SeasonSelector from '../../components/SeasonSelector/SeasonSelector';
import PlayerList from '../../pages/Players/PlayerList';
import Modal from '../../pages/Players/Modal';
import './Players.css';

const Players = () => {
  const { teamId } = useParams();
  const navigate = useNavigate();
  const [selectedSeason, setSelectedSeason] = useState('');
  const [players, setPlayers] = useState({});
  const [searchTerm, setSearchTerm] = useState('');
  const [modal, setModal] = useState({ type: null, player: null });
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/players');
        const data = await response.json();
        setPlayers(data.players);
        setSelectedSeason(Object.keys(data.players)[0]); // Set the first season as default
      } catch (error) {
        console.error('Failed to fetch player data:', error);
      }
    };
    fetchData();
  }, []);  

  const teamPlayers = players[selectedSeason]?.[teamId] || [];
  const filteredPlayers = teamPlayers.filter((player) =>
    player.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const openModal = (type, player = null) => setModal({ type, player });
  const closeModal = () => setModal({ type: null, player: null });

  const handleSavePlayer = async (playerData) => {
    try {
      if (modal.type === 'add') {
        await fetch('http://localhost:5000/api/players', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            season: selectedSeason,
            teamId,
            player: playerData,
          }),
        });
      } else {
        await fetch(`http://localhost:5000/api/players/${playerData.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            season: selectedSeason,
            teamId,
            updatedPlayer: playerData,
          }),
        });
      }
      closeModal();
  
      // Refresh the players data
      const updatedResponse = await fetch('http://localhost:5000/api/players');
      const updatedData = await updatedResponse.json();
      setPlayers(updatedData.players); // Ensure `players` or `teams` is updated
    } catch (error) {
      console.error('Failed to save player:', error);
    }
  };
  

  const handleDeletePlayer = async (playerId) => {
    try {
      await fetch(`http://localhost:5000/api/players/${playerId}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          season: selectedSeason,
          teamId,
        }),
      });
      const updatedResponse = await fetch('http://localhost:5000/api/players');
      const updatedData = await updatedResponse.json();
      setPlayers(updatedData.players);
    } catch (error) {
      console.error('Failed to delete player:', error);
    }
  };

  const navigateToPlayerInfo = (playerId) => navigate(`/teams/${teamId}/players/${playerId}`);

  return (
    <div className="players-container">
      <div className="header-container">
        <button onClick={() => navigate('/teams')} className="back-to-teams">Quay lại</button>
        <h2>Quản lý cầu thủ</h2>
      </div>
      <SeasonSelector
        seasons={Object.keys(players)}
        selectedSeason={selectedSeason}
        onSeasonChange={setSelectedSeason}
      />
      <div className="search-container">
        <input
          type="text"
          placeholder="Tìm kiếm cầu thủ..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        {searchTerm && <button onClick={() => setSearchTerm('')}>&#x2715;</button>}
      </div>
      <button onClick={() => openModal('add')} className="add-player">Thêm cầu thủ</button>
      <PlayerList
        players={filteredPlayers}
        onEdit={(player) => openModal('edit', player)}
        onDelete={handleDeletePlayer}
        onNavigate={navigateToPlayerInfo}
      />
      {modal.type && (
      <Modal
        type={modal.type}
        player={modal.player}
        positions={['Tiền đạo', 'Tiền vệ', 'Hậu vệ', 'Thủ môn']}
        season={selectedSeason}
        onSave={handleSavePlayer}
        onCancel={closeModal}
      />
    )}
    </div>
  );
};

export default Players;
