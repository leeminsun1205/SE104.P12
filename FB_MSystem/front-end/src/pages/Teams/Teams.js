// src/pages/Teams/Teams.js

import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import SeasonSelector from "../../components/SeasonSelector/SeasonSelector";
import AddTeamsToSeasonModal from "./AddTeamsToSeasonModal";
import "./Teams.css";

function Teams({
  teams,
  seasons,
  selectedSeason,
  onSeasonChange,
  onDeleteTeam,
}) {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredTeams, setFilteredTeams] = useState([]);
  const [showAddTeamsModal, setShowAddTeamsModal] = useState(false);

  useEffect(() => {
    const term = searchTerm.trim().toLowerCase();
    setFilteredTeams(
      teams.filter((team) => team.name.toLowerCase().includes(term))
    );
  }, [teams, searchTerm]);

  const handleDelete = (id) => {
    const confirmDelete = window.confirm(
      "Bạn có chắc chắn muốn xóa đội bóng này?"
    );
    if (confirmDelete) {
      onDeleteTeam(id);
    }
  };

  const handleToPlayer = (id) => {
    navigate(`/teams/${id}/players`);
  };

  const handleEdit = (id) => {
    navigate(`/teams/edit/${id}`);
  };

  const handleAddTeamsToSeason = async (selectedTeamIds, season) => {
    setShowAddTeamsModal(false);
  
    for (const teamId of selectedTeamIds) {
      try {
        const response = await fetch(
          `http://localhost:5000/api/teams/${teamId}`
        );
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const teamToAdd = await response.json();
        if (teamToAdd) {
          setFilteredTeams((prevTeams) => {
            if (!prevTeams.some((team) => team.id === teamToAdd.id)) {
              return [...prevTeams, { ...teamToAdd, season: season }];
            }
            return prevTeams;
          });
        }
      } catch (error) {
        console.error("Error fetching team data:", error);
      }
    }
  
    try {
      const response = await fetch(
        `http://localhost:5000/api/seasons/${season}/teams`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ teamIds: selectedTeamIds }),
        }
      );
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to add teams to season");
      }
  
      await onSeasonChange(season);
    } catch (error) {
      console.error("Error adding teams to season:", error);
    }
  };

  const clearSearch = () => setSearchTerm("");

  return (
    <div className="teams">
      <h2>Danh sách đội bóng</h2>
      <SeasonSelector
        seasons={seasons}
        selectedSeason={selectedSeason}
        onSeasonChange={onSeasonChange}
      />
      <div className="search-container">
        <div className="search-input-wrapper">
          <p>Tìm kiếm</p>
          <input
            type="text"
            placeholder="Tìm kiếm đội bóng..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {searchTerm && (
            <button className="clear-search" onClick={clearSearch}>
              ✕
            </button>
          )}
        </div>
      </div>

      <button
        className="add-to-season-button"
        onClick={() => setShowAddTeamsModal(true)}
      >
        Thêm đội bóng vào mùa giải
      </button>

      {showAddTeamsModal && (
        <AddTeamsToSeasonModal
          season={selectedSeason}
          onAddTeamsToSeason={handleAddTeamsToSeason}
          onClose={() => setShowAddTeamsModal(false)} 
        />
      )}

      {filteredTeams.length > 0 ? (
        <ul>
          {filteredTeams.map((team) => (
            <li key={team.id}>
              <h3>
                <Link to={`/teams/${team.id}`}>{team.name}</Link>
              </h3>
              <p>Thành phố: {team.city}</p>
              <div className="actions">
                <button
                  className="toplayer"
                  onClick={() => handleToPlayer(team.id)}
                >
                  Cầu thủ
                </button>
                <button className="edit" onClick={() => handleEdit(team.id)}>
                  Sửa
                </button>
                <button className="delete" onClick={() => handleDelete(team.id)}>
                  Xóa
                </button>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <div className="empty-state">
          <p>
            Không tìm thấy đội bóng nào. Hãy thử tìm kiếm với từ khóa
            khác.
          </p>
        </div>
      )}
    </div>
  );
}

export default Teams;