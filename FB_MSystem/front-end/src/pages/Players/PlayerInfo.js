import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './PlayerInfo.css';

const PlayerInfo = ({ players }) => {
  const { teamId, playerId } = useParams();
  const [player, setPlayer] = useState(null);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    console.log("Rendering PlayerInfo for playerId:", playerId, "and teamId:", teamId);
    console.log("Players data:", players);
  }, [playerId, teamId, players]);

  useEffect(() => {
    const findPlayerLocally = () => {
      const selectedSeason = Object.keys(players || {})[0]; // Assuming you have at least one season
      return players[selectedSeason]?.[teamId]?.find((p) => p.id.toString() === playerId);
    };

    const fetchPlayerFromAPI = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/teams/${teamId}/players/${playerId}`);
        if (!response.ok) {
          throw new Error('Player not found');
        }
        const data = await response.json();
        setPlayer(data);
      } catch (err) {
        setError(err.message);
      }
    };

    const foundPlayer = findPlayerLocally();
    if (foundPlayer) {
      setPlayer(foundPlayer);
    } else {
      fetchPlayerFromAPI();
    }
  }, [playerId, players, teamId]);

  if (error) {
    return (
      <div className="player-info-container">
        <h2>{error}</h2>
        <button onClick={() => navigate(-1)} className="back-button">
          Quay lại
        </button>
      </div>
    );
  }

  if (!player) {
    return (
      <div className="player-info-container">
        <h2>Đang tải thông tin cầu thủ...</h2>
        <button onClick={() => navigate(-1)} className="back-button">
          Quay lại
        </button>
      </div>
    );
  }

  const calculateAge = (dob) => {
    // ... (same logic as before)
  };

  return (
    <div className="player-info-container">
      <button onClick={() => navigate(-1)} className="back-button">
        Quay lại
      </button>
      <h2>Thông tin cầu thủ</h2>
      <div className="player-details">
        <p><strong>Tên:</strong> {player.name}</p>
        <p><strong>Năm sinh:</strong> {player.dob}</p>
        <p><strong>Tuổi:</strong> {calculateAge(player.dob)}</p>
        <p><strong>Vị trí:</strong> {player.position}</p>
        <p><strong>Quốc tịch:</strong> {player.nationality}</p>
        <p><strong>Nơi sinh:</strong> {player.birthplace}</p>
        <p><strong>Chiều cao:</strong> {player.height} cm</p>
        <p><strong>Cân nặng:</strong> {player.weight} kg</p>
        <p><strong>Tiểu sử:</strong> {player.bio}</p>
        <p><strong>Mùa giải:</strong> {player.season}</p>
      </div>
    </div>
  );
};

export default PlayerInfo;