import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import PlayerList from "./PlayerList";
import CreatePlayer from "../CreateNew/CreatePlayer";
import AddPlayersToTeamModal from "./AddPlayersToTeamModal";
import SeasonSelector from "../../components/SeasonSelector/SeasonSelector";
import "./Players.css";

function Players({ seasons }) {
  const { teamId } = useParams();
  const navigate = useNavigate();
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showCreatePlayer, setShowCreatePlayer] = useState(false);
  const [showAddPlayersModal, setShowAddPlayersModal] = useState(false);
  const [selectedSeason, setSelectedSeason] = useState(""); // Initialize to an empty string for "All Seasons"
  const [availablePlayers, setAvailablePlayers] = useState([]);
  const [teamName, setTeamName] = useState(""); // State for team name

  // Fetch players for the selected team and season
  useEffect(() => {
    const fetchTeamName = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/teams/${teamId}`);
        if (!response.ok) {
          throw new Error("Failed to fetch team data");
        }
        const data = await response.json();
        setTeamName(data.name);
      } catch (error) {
        console.error("Error fetching team name:", error);
      }
    };

    fetchTeamName();
  }, [teamName]);

  useEffect(() => {
    const fetchPlayers = async () => {
      setLoading(true);
      try {
        let url = `http://localhost:5000/api/teams/${teamId}/players`;
        if (selectedSeason) {
          url += `?season=${selectedSeason}`;
        }
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error("Failed to fetch players");
        }
        const data = await response.json();
        setPlayers(data.players);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPlayers();
  }, [teamId, selectedSeason]);

  // Fetch available players (not in the current team) for the selected season
  useEffect(() => {
    const fetchAvailablePlayers = async () => {
      try {
        let url = `http://localhost:5000/api/players/available`;
        if (selectedSeason) {
          url += `?season=${selectedSeason}`;
        }
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error("Failed to fetch available players");
        }
        const data = await response.json();
        setAvailablePlayers(data.players);
      } catch (error) {
        console.error("Error fetching available players:", error);
        setError("Failed to fetch available players.");
      }
    };

    fetchAvailablePlayers();
  }, [selectedSeason]);

  // Handle adding a new player (created via CreatePlayer modal)
  const handleAddPlayer = (newPlayer) => {
    setPlayers((prevPlayers) => [...prevPlayers, newPlayer]);
    setShowCreatePlayer(false);
  };

  // Handle deleting a player from the team
  const handleDeletePlayer = async (playerId) => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/teams/${teamId}/players/${playerId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ season: selectedSeason }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to delete player");
      }

      setPlayers((prevPlayers) =>
        prevPlayers.filter((player) => player.id !== playerId)
      );
    } catch (error) {
      console.error("Error deleting player:", error);
      setError(error.message);
    }
  };

  const handleAddPlayersToTeam = (newPlayers) => {
    // Update the players state to include the new players
    setPlayers(prevPlayers => [...prevPlayers, ...newPlayers]);
  
    // Update the availablePlayers state to remove the added players
    setAvailablePlayers(prevAvailablePlayers =>
      prevAvailablePlayers.filter(player => !newPlayers.some(newPlayer => newPlayer.id === player.id))
    );
  
    // Close the modal
    setShowAddPlayersModal(false);
  };

  // Navigate to the player details page
  const handleNavigate = (player) => {
    navigate(`/teams/${teamId}/players/${player.id}`, { state: { player } });
  };
  const handleToTeams = () => {
    navigate(`/teams`)
  }
  // Handle season change from the SeasonSelector
  const handleSeasonChange = (newSeason) => {
    setSelectedSeason(newSeason);
  };

  return (
    <div className="players-container">
      <button
        className="back-to-teams"
        onClick={() => handleToTeams()}
      >
        Quay lại
      </button>
      <h2>Cầu thủ trong đội {teamName}</h2> 
      <SeasonSelector
        seasons={seasons}
        selectedSeason={selectedSeason}
        onSeasonChange={handleSeasonChange}
      />
      <button
        className="add-players-button"
        onClick={() => setShowAddPlayersModal(true)}
      >
        Thêm cầu thủ vào đội
      </button>
      
      {showAddPlayersModal && (
        <AddPlayersToTeamModal
          teamId={teamId}
          season={selectedSeason}
          onAddPlayersToTeam={handleAddPlayersToTeam}
          onClose={() => setShowAddPlayersModal(false)}
        />
      )}
      {showCreatePlayer && (
        <div className="create-player-modal">
          <div className="modal-content">
            <CreatePlayer
              seasons={seasons}
              onAddPlayer={handleAddPlayer}
              onClose={() => setShowCreatePlayer(false)}
            />
          </div>
        </div>
      )}
      {error && <p className="error-message">{error}</p>}
      {loading ? (
        <p>Đang tải...</p>
      ) : players.length > 0 ? (
        <PlayerList
          players={players}
          onDelete={handleDeletePlayer}
          onNavigate={handleNavigate}
          season={selectedSeason}
        />
      ) : (
        <div className="empty-state">
          <p>Không tìm thấy cầu thủ trong đội {teamName}</p>
        </div>
      )}
    </div>
  );
}

export default Players;