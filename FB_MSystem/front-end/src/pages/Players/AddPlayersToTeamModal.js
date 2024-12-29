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
        const allPlayersResponse = await fetch(`${aAPI_URl}/cau-thu`);
        if (!allPlayersResponse.ok) {
          throw new Error("Failed to fetch all players");
        }
        const allPlayersData = await allPlayersResponse.json();
        const allPlayers = allPlayersData.cauThu;
        // Fetch players currently in the team for the selected season
        let currentTeamPlayersResponse; // Khai báo biến ở bên ngoài
        console.log(season)
        if (season === 'all' || season === '') {
          currentTeamPlayersResponse = await fetch(
            `${aAPI_URl}/cau-thu`
          );
        }
        else {
          currentTeamPlayersResponse = await fetch(
            `${aAPI_URl}/mg-db/mua-giai/${season}/doi-bong/${teamId}`
          );
        }
        if (!currentTeamPlayersResponse.ok) {
          throw new Error("Failed to fetch current team players");
        }
        const currentTeamPlayersData = await currentTeamPlayersResponse.json();
        const currentTeamPlayerIds = currentTeamPlayersData.cauThu.map(
          (player) => player.MaCauThu
        );
        let filteredPlayers
        if (season === 'all' || season === '') {
          filteredPlayers = allPlayers
        }
        else {
          filteredPlayers = allPlayers.filter(
            (player) => !currentTeamPlayerIds.includes(player.MaCauThu)
          );
        }

        setAvailablePlayers(filteredPlayers);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    // Fetch available players only if a season is selected
    if (season) {
      fetchAvailablePlayers();
    } else {
      // Optionally handle the case where no season is selected (e.g., display all players)
      // For now, let's set availablePlayers to an empty array or handle it as needed.
      setAvailablePlayers([]);
    }
  }, [aAPI_URl, teamId, season]);

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
      const playersToAdd = selectedPlayers.map((playerId) => ({
        MaCauThu: playerId,
        MaDoiBong: teamId,
        MaMuaGiai: season, // Ensure you send the season information
      }));

      const response = await fetch(`${aAPI_URl}/db-ct/createMany`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ links: playersToAdd }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to add players to team");
      }
      onAddPlayersToTeam(selectedPlayers);
      setSelectedPlayers([]);
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