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
        // Correctly fetch available players from the backend
        const response = await fetch(
          `http://localhost:5000/api/players?season=no%20season`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch available players");
        }
        const data = await response.json();
        setAvailablePlayers(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAvailablePlayers();
  }, [teamId, season]);

  const handlePlayerSelection = (playerId) => {
    setSelectedPlayers((prevSelectedPlayers) =>
      prevSelectedPlayers.includes(playerId)
        ? prevSelectedPlayers.filter((id) => id !== playerId)
        : [...prevSelectedPlayers, playerId]
    );
  };

  const handleAddPlayers = async () => {
    setLoading(true); // Set loading to true when starting the operation
    try {
      // Send the request to add players to the team
      const response = await fetch(
        `http://localhost:5000/api/teams/${teamId}/players`,
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

      // Update local state to reflect the changes
      const updatedPlayers = availablePlayers.filter((player) =>
        selectedPlayers.includes(player.id)
      );
      onAddPlayersToTeam(updatedPlayers); // Update parent component's state

      // Remove added players from the available players list
      setAvailablePlayers((prevAvailablePlayers) =>
        prevAvailablePlayers.filter(
          (player) => !selectedPlayers.includes(player.id)
        )
      );

      setSelectedPlayers([]); // Clear selected players
      onClose();
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false); // Set loading to false after the operation is complete
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