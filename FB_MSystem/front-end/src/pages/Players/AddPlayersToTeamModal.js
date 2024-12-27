import React, { useState, useEffect } from "react";
import "./AddPlayersToTeamModal.css";

function AddPlayersToTeamModal({ teamId, season, onAddPlayersToTeam, onClose }) {
  const [availablePlayers, setAvailablePlayers] = useState([]);
  const [selectedPlayers, setSelectedPlayers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAvailablePlayers = async () => {
      setLoading(true);
      try {
        const response = await fetch(`http://localhost:5000/cau-thu`);
        if (!response.ok) {
          throw new Error("Failed to fetch available players");
        }
        let data = await response.json();

        // Filter out players that are already in a team for the selected season
        if (season) {
          data = data.filter(player => player.season !== season);
        }

        setAvailablePlayers(data);
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
      // Send the request to add players to the team
      const response = await fetch(
        `http://localhost:5000/db-ct/doi-bong/${teamId}/cau-thu`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            season: season,
            playerIds: selectedPlayers,
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to add players to team");
      }

      // Assuming the backend returns the updated list of players for the team
      const updatedPlayers = await response.json();

      // Instead of updating the state directly, call onAddPlayersToTeam
      // to let the parent component (Players.js) manage the state
      onAddPlayersToTeam(selectedPlayers);

      // Remove added players from the available players list
      setAvailablePlayers((prevAvailablePlayers) =>
        prevAvailablePlayers.filter(
          (player) => !selectedPlayers.includes(player.MaCauThu)
        )
      );

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