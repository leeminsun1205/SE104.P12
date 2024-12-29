import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import PlayerList from "./PlayerList";
import CreatePlayer from "../CreateNew/CreatePlayer";
import AddPlayersToTeamModal from "./AddPlayersToTeamModal";
import SeasonSelector from "../../components/SeasonSelector/SeasonSelector";
import "./Players.css";

function Players({ API_URL }) {
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
  const [availableSeasons, setAvailableSeasons] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [playersPerPage] = useState(5);
  const paginationRange = 5;

  useEffect(() => {
    const fetchTeamName = async () => {
      try {
        const response = await fetch(`${API_URL}/doi-bong/${MaDoiBong}`);
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
  }, [MaDoiBong, API_URL]);

  useEffect(() => {
    const fetchAvailableSeasons = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`${API_URL}/mua-giai`);
        if (!response.ok) {
          throw new Error("Failed to fetch seasons");
        }
        const seasonsData = await response.json();
        const filteredSeasons = [];
        for (const season of seasonsData.muaGiai) {
          const doiBongResponse = await fetch(`${API_URL}/mg-db/mua-giai/${season.MaMuaGiai}/doi-bong`);
          if (doiBongResponse.ok) {
            const doiBongData = await doiBongResponse.json();
            const teamExistsInSeason = doiBongData.some(
              (team) => team.MaDoiBong === MaDoiBong
            );
            if (teamExistsInSeason) {
              filteredSeasons.push(season);
            }
          } else {
            console.error(`Failed to fetch team data for season ${season.MaMuaGiai}`);
          }
        }
        setAvailableSeasons(filteredSeasons);
        if (filteredSeasons.length > 0 && !selectedSeason) {
          setSelectedSeason(filteredSeasons[0].MaMuaGiai);
        }
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAvailableSeasons();
  }, [API_URL, MaDoiBong, selectedSeason]);

  useEffect(() => {
    if (selectedSeason) {
      const fetchPlayers = async () => {
        setLoading(true);
        setError(null);
        try {
          let url = `${API_URL}/mg-db/mua-giai/${selectedSeason}/doi-bong/${MaDoiBong}`;
          const response = await fetch(url);
          if (!response.ok) {
            throw new Error("Failed to fetch players");
          }
          let data = await response.json();
          setPlayers(data.cauThu);
          setCurrentPage(1);
        } catch (error) {
          setError(error.message);
        } finally {
          setLoading(false);
        }
      };

      fetchPlayers();
    }
  }, [API_URL, MaDoiBong, selectedSeason]);

  useEffect(() => {
    const fetchAvailablePlayers = async () => {
      try {
        const response = await fetch(`${API_URL}/cau-thu`);
        if (!response.ok) {
          throw new Error("Failed to fetch available players");
        }
        const data = await response.json();
        setAvailablePlayers(data.cauThu);
      } catch (error) {
        console.error("Error fetching available players:", error);
        setError("Failed to fetch available players.");
      }
    };

    fetchAvailablePlayers();
  }, [API_URL]);

  const handleAddPlayer = (newPlayer) => {
    setPlayers((prevPlayers) => [...prevPlayers, newPlayer]);
    setShowCreatePlayer(false);
  };

  const handleCloseCreatePlayerModal = () => {
    setShowCreatePlayer(false);
  };

  const handleDeletePlayer = async (playerId) => {
    try {
      let url = `${API_URL}/mg-db/mua-giai/${selectedSeason}/doi-bong/${MaDoiBong}/cau-thu/${playerId}`;
      const response = await fetch(url, {
        method: "DELETE",
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to delete player");
      }

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
    setError(null); // Reset error before making the request
    try {
      const playersToAdd = selectedPlayerIds.map((playerId) => ({
        MaDoiBong: MaDoiBong,
        MaCauThu: playerId,
        MaMuaGiai: selectedSeason,
      }));
      const response = await fetch(`${API_URL}/db-ct/createMany`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ links: playersToAdd }),
      });
      if (!response.ok) {
        const errorData = await response.json();
        // Kiểm tra xem lỗi có phải do cầu thủ đã ở đội khác không
        if (errorData.message && errorData.message.includes("already in another team")) {
          setError("Một hoặc nhiều cầu thủ bạn chọn đã ở trong đội khác.");
        } else {
          setError(errorData.message || "Không thể thêm cầu thủ vào đội.");
        }
        return; // Dừng lại nếu có lỗi
      }

      const fetchPlayersResponse = await fetch(
        `${API_URL}/mg-db/mua-giai/${selectedSeason}/doi-bong/${MaDoiBong}`
      );
      if (fetchPlayersResponse.ok) {
        const newData = await fetchPlayersResponse.json();
        setPlayers(newData.cauThu);
      }
      setAvailablePlayers((prevAvailablePlayers) =>
        prevAvailablePlayers.filter(
          (player) => !selectedPlayerIds.includes(player.MaCauThu)
        )
      );
      setShowAddPlayersModal(false);
    } catch (error) {
      setError(error.message || "Đã xảy ra lỗi khi thêm cầu thủ.");
    } finally {
      setLoading(false);
    }
  };
  const handleNavigate = (player) => {
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

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const filteredPlayers = players.filter((player) =>
    player.TenCauThu.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const indexOfLastPlayer = currentPage * playersPerPage;
  const indexOfFirstPlayer = indexOfLastPlayer - playersPerPage;
  const currentPlayers = filteredPlayers.slice(indexOfFirstPlayer, indexOfLastPlayer);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const totalPages = Math.ceil(filteredPlayers.length / playersPerPage);
  const startPage = Math.max(1, currentPage - Math.floor(paginationRange / 2));
  const endPage = Math.min(totalPages, startPage + paginationRange - 1);

  return (
    <div className="players-container">
      <button className="back-to-teams" onClick={() => handleToTeams()}>
        Quay lại
      </button>
      <h2>Cầu thủ trong đội {teamName}</h2>
      <SeasonSelector
        seasons={availableSeasons}
        selectedSeason={selectedSeason}
        onSeasonChange={handleSeasonChange}
      />
      { (
        <button
          className="add-players-button"
          onClick={() => setShowAddPlayersModal(true)}
        >
          Thêm cầu thủ vào đội
        </button>
      )}

      {showAddPlayersModal && (
        <AddPlayersToTeamModal
          aAPI_URl={`${API_URL}`}
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
              seasons={availableSeasons}
              onAddPlayer={handleAddPlayer}
              onClose={handleCloseCreatePlayerModal}
            />
          </div>
        </div>
      )}
      {error && <p className="error-message">{error}</p>}
      {loading ? (
        <p>Đang tải...</p>
      ) : (
        <>
          <div className="search-bar">
            <input
              type="text"
              placeholder="Tìm kiếm cầu thủ..."
              value={searchTerm}
              onChange={handleSearchChange}
            />
          </div>
          {filteredPlayers.length > 0 ? (
            <>
              <PlayerList
                players={currentPlayers}
                onDelete={handleDeletePlayer}
                onNavigate={handleNavigate}
                season={selectedSeason}
              />
              <div className="pagination">
                <button
                  onClick={() => paginate(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  Trước
                </button>
                {Array.from({ length: endPage - startPage + 1 }).map(
                  (_, index) => {
                    const pageNumber = startPage + index;
                    return (
                      <button
                        key={pageNumber}
                        onClick={() => paginate(pageNumber)}
                        className={currentPage === pageNumber ? "active" : ""}
                      >
                        {pageNumber}
                      </button>
                    );
                  }
                )}
                <button
                  onClick={() => paginate(currentPage + 1)}
                  disabled={currentPage === totalPages}
                >
                  Sau
                </button>
              </div>
            </>
          ) : (
            <div className="empty-state">
              <p>Không tìm thấy cầu thủ nào phù hợp với "{searchTerm}" trong đội {teamName} cho mùa giải này.</p>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default Players;