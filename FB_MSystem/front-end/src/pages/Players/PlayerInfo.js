import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import "./PlayerInfo.css";
import { calculateAge } from "./PlayerList";

const PlayerInfo = () => {
  const { teamId, playerId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [player, setPlayer] = useState(location.state?.player || null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!player) {
      const fetchPlayerFromAPI = async () => {
        try {
          const response = await fetch(
            `http://localhost:5000/api/teams/${teamId}/players/${playerId}`
          );
          if (!response.ok) {
            throw new Error("Player not found");
          }
          const data = await response.json();
          setPlayer(data);
        } catch (err) {
          setError(err.message);
        }
      };

      fetchPlayerFromAPI();
    }
  }, [teamId, playerId, player]);

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

  return (
    <div className="player-info-container">
      <button onClick={() => navigate(-1)} className="back-button">
        Quay lại
      </button>
      <h2>Thông tin cầu thủ</h2>
      <div className="player-details">
        <p>
          <strong>Tên:</strong> {player.name}
        </p>
        <p>
          <strong>Năm sinh:</strong> {player.dob}
        </p>
        <p>
          <strong>Tuổi:</strong> {calculateAge(player.dob)}
        </p>
        <p>
          <strong>Vị trí:</strong> {player.position}
        </p>
        <p>
          <strong>Quốc tịch:</strong> {player.nationality}
        </p>
        <p>
          <strong>Nơi sinh:</strong> {player.birthplace}
        </p>
        <p>
          <strong>Chiều cao:</strong> {player.height} cm
        </p>
        <p>
          <strong>Cân nặng:</strong> {player.weight} kg
        </p>
        <p>
          <strong>Tiểu sử:</strong> {player.bio}
        </p>
        <p>
          <strong>Mùa giải:</strong> {player.season}
        </p>
      </div>
    </div>
  );
};

export default PlayerInfo;