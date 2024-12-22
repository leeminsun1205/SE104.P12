import React, { useState, useEffect } from "react";
import "./AddTeamsToSeasonModal.css";

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
      // Instead of fetching available teams, pass selectedTeams directly
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
        <h2>Add Teams to Season {season}</h2>
        {error && <p className="error-message">{error}</p>}
        {loading ? (
          <p>Loading available teams...</p>
        ) : (
          <>
            <ul className="team-list">
              {availableTeams.map((team) => (
                <li key={team.id} className="team-item">
                  <label className="team-label">
                    <input
                      type="checkbox"
                      className="team-checkbox"
                      checked={selectedTeams.includes(team.id)}
                      onChange={() => handleTeamSelection(team.id)}
                    />
                    <span className="team-name">{team.name}</span>
                  </label>
                </li>
              ))}
            </ul>
            <div className="modal-buttons">
              <button className="add-button" onClick={handleAddTeams}>
                Add Selected Teams
              </button>
              <button className="cancel-button" onClick={onClose}>
                Cancel
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default AddTeamsToSeasonModal;