import React, { useState, useEffect } from "react";
import "./AddPlayersToTeamModal.css";

function AddPlayersToTeamModal({ aAPI_URl, teamId, season, onAddPlayersToTeam, onClose }) {
  const [availablePlayers, setAvailablePlayers] = useState([]);
  const [selectedPlayers, setSelectedPlayers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAvailablePlayers = async () => {
      setLoading(true);
      try {
        const response = await fetch(`${aAPI_URl}/cau-thu`);
        if (!response.ok) {
          throw new Error("Failed to fetch available players");
        }
        let data = await response.json();
        const filteredPlayers = data.cauThu.filter(player => {
          return player.MaCauThu !== teamId || player.MaMuaGiai !== season;
        });
        setAvailablePlayers(filteredPlayers);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    if (season) {
      fetchAvailablePlayers();
    }
  }, [teamId, season]);

  const handlePlayerSelection = (playerId) => {
    setSelectedPlayers((prevSelectedPlayers) =>
      prevSelectedPlayers.includes(playerId)
        ? prevSelectedPlayers.filter((id) => id !== playerId)
        : [...prevSelectedPlayers, playerId]
    );
  };

  const handleAddPlayers = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `${aAPI_URl}/db-cb/createMany`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({links: selectedPlayers.map(playerId => ({
            MaCauThu: playerId,
            MaDoiBong: teamId,
          }))}),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to add players to team");
      }
      onAddPlayersToTeam(selectedPlayers);

      setSelectedPlayers([]); // Clear selected players
      onClose();
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
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
                <li key={player.MaCauThu} className="player-item">
                  <label className="player-label">
                    <input
                      type="checkbox"
                      className="player-checkbox"
                      checked={selectedPlayers.includes(player.MaCauThu)}
                      onChange={() => handlePlayerSelection(player.MaCauThu)}
                    />
                    <span className="player-name">{player.TenCauThu}</span>
                  </label>
                </li>
              ))}
            </ul>
            <div className="modal-buttons">
              <button
                className="add-button"
                onClick={handleAddPlayers}
                disabled={loading}
              >
                {loading ? "Đang thêm..." : "Thêm cầu thủ đã chọn"}
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