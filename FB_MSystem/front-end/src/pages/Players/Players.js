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
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showCreatePlayer, setShowCreatePlayer] = useState(false);
  const [showAddPlayersModal, setShowAddPlayersModal] = useState(false);
  const [selectedSeason, setSelectedSeason] = useState("");
  const [availablePlayers, setAvailablePlayers] = useState([]);
  const [teamName, setTeamName] = useState("");

  useEffect(() => {
    const fetchTeamName = async () => {
      try {
        const response = await fetch(`http://localhost:5000/db-ct/${teamId}`);
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
  }, [teamId]);

  // useEffect thứ hai - Sửa lại URL để bao gồm teamId
  useEffect(() => {
    const fetchPlayers = async () => {
      setLoading(true);
      try {
        let url = `http://localhost:5000/db-ct/doi-bong/${teamId}/cau-thu`;
        if (selectedSeason && selectedSeason !== "all") {
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

  useEffect(() => {
    const fetchAvailablePlayers = async () => {
      try {
        let url = `http://localhost:5000/cau-thu`;
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error("Failed to fetch available players");
        }
        const data = await response.json();
        setAvailablePlayers(data);
      } catch (error) {
        console.error("Error fetching available players:", error);
        setError("Failed to fetch available players.");
      }
    };

    fetchAvailablePlayers();
  }, [selectedSeason]);

  const handleAddPlayer = (newPlayer) => {
    setPlayers((prevPlayers) => [...prevPlayers, newPlayer]);
    setShowCreatePlayer(false);
  };

  const handleDeletePlayer = async (playerId) => {
    try {
      const response = await fetch(
        `http://localhost:5000/db-ct/doi-bong/${teamId}/cau-thu/${playerId}`,
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
  
      // Cập nhật state players dựa trên selectedSeason
      setPlayers((prevPlayers) => {
        if (selectedSeason === "all") {
          // Lọc bỏ player khỏi tất cả các mùa giải
          return prevPlayers.filter((player) => player.id !== playerId);
        } else {
          // Lọc bỏ player chỉ trong selectedSeason
          return prevPlayers.filter(
            (player) => !(player.id === playerId && player.season === selectedSeason)
          );
        }
      });
    } catch (error) {
      console.error("Error deleting player:", error);
      setError(error.message);
    }
  };
  

 const handleAddPlayersToTeam = async (selectedPlayerIds) => {
    if (selectedPlayerIds.length === 0) return;

    setLoading(true);
    try {
      const response = await fetch(
        `http://localhost:5000/db-ct/doi-bong/${teamId}/cau-thu`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            season: selectedSeason,
            playerIds: selectedPlayerIds,
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to add players to team");
      }

      // Get updated players from response data
      const { updatedPlayers } = await response.json();

      // Add new players to the existing list
      setPlayers((prevPlayers) => [...prevPlayers, ...updatedPlayers]);

      // Filter out added players from the available players list
      setAvailablePlayers((prevAvailablePlayers) =>
        prevAvailablePlayers.filter(
          (player) => !selectedPlayerIds.includes(player.id)
        )
      );

      setShowAddPlayersModal(false);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };
  const handleNavigate = (player) => {
    navigate(`/db-ct/doi-bong/${teamId}/cau-thu/${player.id}`, { state: { player } });
  };
  const handleToTeams = () => {
    navigate(`/db-ct/doi-bong`);
  };

  const handleSeasonChange = (newSeason) => {
    setSelectedSeason(newSeason);
  };

  return (
    <div className="players-container">
      <button className="back-to-teams" onClick={() => handleToTeams()}>
        Quay lại
      </button>
      <h2>Cầu thủ trong đội {teamName}</h2>
      <SeasonSelector
        seasons={seasons}
        selectedSeason={selectedSeason}
        onSeasonChange={handleSeasonChange}
      />
      {/* Check for both not "all" and not an empty string */}
      {selectedSeason !== "all" && selectedSeason !== "" && (
        <button
          className="add-players-button"
          onClick={() => setShowAddPlayersModal(true)}
        >
          Thêm cầu thủ vào đội
        </button>
      )}

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