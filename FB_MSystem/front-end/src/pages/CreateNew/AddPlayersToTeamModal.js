import React, { useState, useEffect } from "react";
import "./AddPlayersToTeamModal.css";

function AddPlayersToTeamModal({ teamId, season, onAddPlayersToTeam, onClose }) {
  const [availablePlayers, setAvailablePlayers] = useState([]);
  const [selectedPlayers, setSelectedPlayers] = useState([]);
  const [loading, setLoading] = useState(false); 
  const [error, setError] = useState(null);

  const dummyAvailablePlayers = [
    { id: 4, name: "Player 4", position: "Tiền đạo" },
    { id: 5, name: "Player 5", position: "Tiền vệ" },
    { id: 6, name: "Player 6", position: "Hậu vệ" },
    { id: 7, name: "Player 7", position: "Thủ môn" },
    { id: 8, name: "Player 8", position: "Tiền đạo" },
    { id: 9, name: "Player 9", position: "Tiền vệ" },
  ];

  useEffect(() => {
    const timeoutId = setTimeout(() => {
        setAvailablePlayers(dummyAvailablePlayers);
        setLoading(false);
      }, 500); // Delay of 500ms
  
      return () => clearTimeout(timeoutId);
    }, [teamId, season]);

  const handlePlayerSelection = (playerId) => {
    setSelectedPlayers((prevSelectedPlayers) =>
      prevSelectedPlayers.includes(playerId)
        ? prevSelectedPlayers.filter((id) => id !== playerId)
        : [...prevSelectedPlayers, playerId]
    );
  };

  const handleAddPlayers = () => {
    onAddPlayersToTeam(selectedPlayers);
    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="add-players-modal">
        <h2>Thêm cầu thủ vào đội </h2>
        {error && <p className="error-message">{error}</p>}
        {loading ? (
          <p>Đang tải cầu thủ...</p>
        ) : (
          <>
            <ul className="player-list">
              {availablePlayers.map((player) => (
                <li key={player.id} className="player-item">
                  <label className="player-label">
                    <input
                      type="checkbox"
                      className="player-checkbox"
                      checked={selectedPlayers.includes(player.id)}
                      onChange={() => handlePlayerSelection(player.id)}
                    />
                    <span className="player-name">{player.name}</span>
                  </label>
                </li>
              ))}
            </ul>
            <div className="modal-buttons">
              <button className="add-button" onClick={handleAddPlayers}>
                Thêm cầu thủ đã chọn
              </button>
              <button className="cancel-button" onClick={onClose}>
                Hủy
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default AddPlayersToTeamModal;