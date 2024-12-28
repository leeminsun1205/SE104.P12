import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import PlayerList from "./PlayerList";
import CreatePlayer from "../CreateNew/CreatePlayer";
import AddPlayersToTeamModal from "./AddPlayersToTeamModal";
import SeasonSelector from "../../components/SeasonSelector/SeasonSelector";
import "./Players.css";

function Players({ API_URL, seasons }) {
  const { MaDoiBong } = useParams();
  const navigate = useNavigate();
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showCreatePlayer, setShowCreatePlayer] = useState(false);
  const [showAddPlayersModal, setShowAddPlayersModal] = useState(false);
  const [selectedSeason, setSelectedSeason] = useState("");
  const [availablePlayers, setAvailablePlayers] = useState([]);
  const [teamName, setTeamName] = useState("");

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [playersPerPage] = useState(5); // You can adjust the number of players per page

  useEffect(() => {
    const fetchTeamName = async () => {
      try {
        const response = await fetch(`http://localhost:5000/doi-bong/${MaDoiBong}`);
        if (!response.ok) {
          throw new Error("Failed to fetch team data");
        }
        const data = await response.json();
        setTeamName(data.doiBong.TenDoiBong);
      } catch (error) {
        console.error("Error fetching team name:", error);
      }
    };

    fetchTeamName();
  }, [MaDoiBong]);

  // Fetch players based on the selected season
  useEffect(() => {
    const fetchPlayers = async () => {
      setLoading(true);
      setError(null);
      try {
        let url = `${API_URL}/db-ct/doi-bong/${MaDoiBong}/cau-thu`;
        if (selectedSeason && selectedSeason !== "all") {
          url += `?season=${selectedSeason}`;
        }
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error("Failed to fetch players");
        }
        let data = await response.json();
        console.log(data)
        setPlayers(data.cauThu);
        setCurrentPage(1);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPlayers();
  }, [MaDoiBong, selectedSeason]); // Include selectedSeason in the dependency array

  useEffect(() => {
    const fetchAvailablePlayers = async () => {
      try {
        const response = await fetch(`${API_URL}/cau-thu`);
        if (!response.ok) {
          throw new Error("Failed to fetch available players");
        }
        const data = await response.json();
        console.log(data);
        setAvailablePlayers(data);
      } catch (error) {
        console.error("Error fetching available players:", error);
        setError("Failed to fetch available players.");
      }
    };

    fetchAvailablePlayers();
  }, []); // Fetch available players only once

  const handleAddPlayer = (newPlayer) => {
    setPlayers((prevPlayers) => [...prevPlayers, newPlayer]);
    setShowCreatePlayer(false);
  };

  const handleCloseCreatePlayerModal = () => {
    setShowCreatePlayer(false);
  };

  const handleDeletePlayer = async (playerId) => {
    try {
      let url = `${API_URL}/db-ct/doi-bong/${MaDoiBong}/cau-thu/${playerId}`;
      if (selectedSeason && selectedSeason !== "all") {
        url += `?season=${selectedSeason}`;
      }
      const response = await fetch(url, {
        method: "DELETE",
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to delete player");
      }

      // Update state to remove the deleted player
      setPlayers((prevPlayers) =>
        prevPlayers.filter((player) => player.MaCauThu !== playerId)
      );
    } catch (error) {
      console.error("Error deleting player:", error);
      setError(error.message);
    }
  };

  const handleAddPlayersToTeam = async (selectedPlayerIds) => {
    if (selectedPlayerIds.length === 0) return;

    setLoading(true);
    try {
      const playersToAdd = selectedPlayerIds.map((playerId) => ({
        MaDoiBong: MaDoiBong,
        MaCauThu: playerId,
        MaMuaGiai: selectedSeason,
      }));
      const response = await fetch(`${API_URL}/db-ct/createMany`, {
        // Assuming this endpoint handles adding players to teams for a season
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(playersToAdd),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to add players to team");
      }

      // After successfully adding players, refetch the players for the current season
      const fetchPlayersResponse = await fetch(
        `${API_URL}/db-ct/doi-bong/${MaDoiBong}/cau-thu?season=${selectedSeason}`
      );
      if (fetchPlayersResponse.ok) {
        const newData = await fetchPlayersResponse.json();
        setPlayers(newData.cauThu);
      }

      // Filter out added players from the available players list (optional, depends on your logic)
      setAvailablePlayers((prevAvailablePlayers) =>
        prevAvailablePlayers.filter(
          (player) => !selectedPlayerIds.includes(player.MaCauThu)
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
    console.log();
    navigate(`/doi-bong/${MaDoiBong}/cau-thu/${player.MaCauThu}`, {
      state: { player },
    });
  };
  const handleToTeams = () => {
    navigate(`/doi-bong`);
  };

  const handleSeasonChange = (newSeason) => {
    setSelectedSeason(newSeason);
  };

  // Get current players for pagination
  const indexOfLastPlayer = currentPage * playersPerPage;
  const indexOfFirstPlayer = indexOfLastPlayer - playersPerPage;
  const currentPlayers = players.slice(indexOfFirstPlayer, indexOfLastPlayer);

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

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
          aAPI_URl={"http://localhost:5000"}
          teamId={MaDoiBong}
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
              onClose={handleCloseCreatePlayerModal}
            />
          </div>
        </div>
      )}
      {error && <p className="error-message">{error}</p>}
      {loading ? (
        <p>Đang tải...</p>
      ) : players.length > 0 ? (
        <>
          <PlayerList
            players={currentPlayers}
            onDelete={handleDeletePlayer}
            onNavigate={handleNavigate}
            season={selectedSeason}
          />
          <div className="pagination">
            {Array.from({ length: Math.ceil(players.length / playersPerPage) }).map(
              (_, index) => (
                <button
                  key={index + 1}
                  onClick={() => paginate(index + 1)}
                  className={currentPage === index + 1 ? "active" : ""}
                >
                  {index + 1}
                </button>
              )
            )}
          </div>
        </>
      ) : (
        <div className="empty-state">
          <p>Không tìm thấy cầu thủ trong đội {teamName} cho mùa giải này.</p>
        </div>
      )}
    </div>
  );
}

export default Players;