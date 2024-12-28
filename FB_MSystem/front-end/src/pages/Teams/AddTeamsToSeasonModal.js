// src\pages\Teams\AddTeamsToSeasonModal.js
import React, { useState, useEffect } from "react";
import "./AddTeamsToSeasonModal.module.css";

function AddTeamsToSeasonModal({ season, onAddTeamsToSeason, onClose }) {
  const [availableTeams, setAvailableTeams] = useState([]);
  const [selectedTeams, setSelectedTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAvailableTeams = async () => {
      try {
        const response = await fetch(
          "http://localhost:5000/api/teams/available"
        );
        if (!response.ok) {
          throw new Error("Failed to fetch available teams");
        }
        const data = await response.json();
        setAvailableTeams(data.teams);
      } catch (error) {
        console.error("Error fetching available teams:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAvailableTeams();
  }, [season]);

  const handleTeamSelection = (teamId) => {
    setSelectedTeams((prevSelectedTeams) =>
      prevSelectedTeams.includes(teamId)
        ? prevSelectedTeams.filter((id) => id !== teamId)
        : [...prevSelectedTeams, teamId]
    );
  };

  const handleAddTeams = async () => {
    try {
      onAddTeamsToSeason(selectedTeams, season);
      onClose();
    } catch (error) {
      console.error("Error adding teams to season:", error);
      setError(error.message);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="add-teams-modal">
        <h2>Thêm đội vào mùa giải {season}</h2>
        {error && <p className="error-message">{error}</p>}
        {loading ? (
          <p>Đang tải đội bóng...</p>
        ) : (
          <>
            {/* Update class names here to match the CSS */}
            <ul className="add-teams-list">
              {availableTeams.map((team) => (
                <li key={team.MaDoiBong} className="add-teams-item">
                  <label className="add-teams-label">
                    <input
                      type="checkbox"
                      className="add-teams-checkbox"
                      checked={selectedTeams.includes(team.MaDoiBong)}
                      onChange={() => handleTeamSelection(team.MaDoiBong)}
                    />
                    <span className="add-teams-name">{team.TenDoiBong}</span>
                  </label>
                </li>
              ))}
            </ul>
            <div className="modal-sbuttons">
              <button className="add-sbutton" onClick={handleAddTeams}>
                Thêm đội bóng đã chọn
              </button>
              <button className="cancel-sbutton" onClick={onClose}>
                Hủy
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default AddTeamsToSeasonModal;