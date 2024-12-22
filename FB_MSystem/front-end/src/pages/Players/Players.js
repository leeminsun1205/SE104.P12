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
  const [availableSeasons, setAvailableSeasons] = useState([]); // Add available seasons state
  const [searchTerm, setSearchTerm] = useState('');
  const [modal, setModal] = useState({ type: null, player: null });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSeasons = async () => {
      try {
        const teamsResponse = await fetch('http://localhost:5000/api/teams');
        if (!teamsResponse.ok) {
          throw new Error(`HTTP error! status: ${teamsResponse.status}`);
        }
        const teamsData = await teamsResponse.json();
        const seasons = new Set();
        teamsData.teams.forEach(team => seasons.add(team.season));
        const seasonArray = Array.from(seasons).sort(); // Optional: sort seasons
        setAvailableSeasons(seasonArray);

        // Set default season only if not already selected
        if (!selectedSeason && seasonArray.length > 0) {
          setSelectedSeason(seasonArray[0]);
        }
      } catch (error) {
        console.error("Error fetching seasons:", error);
        setError("Error fetching available seasons.");
      }
    };
    fetchSeasons();
  }, []);

  useEffect(() => {
    const fetchData = async () => {

      setLoading(true);
      setError(null);

      try {
        let response;
        if (selectedSeason === "") {
          response = await fetch(`http://localhost:5000/api/teams/${teamId}/players`);
        } else {
          response = await fetch(`http://localhost:5000/api/teams/${teamId}/players?season=${selectedSeason}`);
        }
        const data = await response.json();

        setPlayers(prevPlayers => ({
          ...prevPlayers,
          [selectedSeason]: {
            ...prevPlayers[selectedSeason],
            [teamId]: data.players || [],
          },
        }));
      } catch (error) {
        console.error('Failed to fetch player data:', error);
        setError("Error loading players. Please try again later.");
        setPlayers(prevPlayers => ({
          ...prevPlayers,
          [selectedSeason]: {
            ...prevPlayers[selectedSeason],
            [teamId]: [],
          },
        }));
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [teamId, selectedSeason]);


  const teamPlayers = players[selectedSeason]?.[teamId] || [];
  const filteredPlayers = teamPlayers.filter((player) =>
    player.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const openModal = (type, player = null) => setModal({ type, player });
  const closeModal = () => setModal({ type: null, player: null });

  const handleSavePlayer = async (playerData) => {
    try {
      const method = modal.type === 'add' ? 'POST' : 'PUT';
      const url = modal.type === 'add' ? `http://localhost:5000/api/teams/${teamId}/players` : `/api/teams/${teamId}/players/${playerData.id}`;
      const body = modal.type === 'add' ?
        JSON.stringify({ season: selectedSeason, player: playerData })
        :
        JSON.stringify({ season: selectedSeason, updatedPlayer: playerData });

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      closeModal();
      const updatedResponse = await fetch(`http://localhost:5000/api/teams/${teamId}/players?season=${selectedSeason}`);
      const updatedData = await updatedResponse.json();
      setPlayers(prevPlayers => ({
        ...prevPlayers,
        [selectedSeason]: {
          ...prevPlayers[selectedSeason],
          [teamId]: updatedData.players
        }
      }));
    } catch (error) {
      console.error('Failed to save player:', error);
      setError(error);
    }
  };

  const handleDeletePlayer = async (playerId) => {
    try {
      const response = await fetch(`http://localhost:5000/api/teams/${teamId}/players/${playerId}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ season: selectedSeason }),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const updatedResponse = await fetch(`http://localhost:5000/api/teams/${teamId}/players?season=${selectedSeason}`);
      const updatedData = await updatedResponse.json();
      setPlayers(prevPlayers => ({
        ...prevPlayers,
        [selectedSeason]: {
          ...prevPlayers[selectedSeason],
          [teamId]: updatedData.players
        }
      }));
    } catch (error) {
      console.error('Failed to delete player:', error);
      setError(error);
    }
  };

  const navigateToPlayerInfo = (playerId) => navigate(`/teams/${teamId}/players/${playerId}`);

  if (loading) return <div>Loading players...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div className="players-container">
      <div className="header-container">
        <button onClick={() => navigate('/teams')} className="back-to-teams">Quay lại</button>
        <h2>Quản lý cầu thủ</h2>
      </div>
      <SeasonSelector
        seasons={availableSeasons}
        selectedSeason={selectedSeason}
        onSeasonChange={(newSeason) => {
          if (newSeason !== selectedSeason) {
            setSelectedSeason(newSeason);
          }
        }}
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
      {selectedSeason && (
        <button onClick={() => openModal('add')} className="add-player">
          Thêm cầu thủ
        </button>
      )}
      {!selectedSeason && (
        <p>Vui lòng chọn mùa giải trước khi thêm cầu thủ.</p>
      )}      <PlayerList
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