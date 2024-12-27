import React, { useState, useMemo, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import SeasonSelector from "../../components/SeasonSelector/SeasonSelector";
import styles from "./Matches.module.css";

const Matches = ({ API_URL }) => {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [availableSeasons, setAvailableSeasons] = useState([]);
  const [selectedSeason, setSelectedSeason] = useState("");
  const [selectedRound, setSelectedRound] = useState("");
  const [players, setPlayers] = useState({}); // Initialize players state here
  const [sortConfig, setSortConfig] = useState({
    key: null,
    direction: "ascending",
  });
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const matchesPerPage = 4;

  // State for modal and editing
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingMatch, setEditingMatch] = useState(null);
  useEffect(() => {
    const fetchSeasons = async () => {
      try {
        const response = await fetch(`${API_URL}/mua-giai`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setAvailableSeasons(data.muaGiai);
      } catch (error) {
        console.error("Lỗi khi tải danh sách mùa giải:", error);
      }
    };

    fetchSeasons();
  }, [API_URL]);

  useEffect(() => {
    if (availableSeasons.length > 0) {
      setSelectedSeason(availableSeasons[0].MaMuaGiai);
    }
  }, [availableSeasons]);

  useEffect(() => {
    const fetchMatches = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          `${API_URL}/tran-dau/mua-giai/${selectedSeason}`
        );
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setMatches(data.tranDau);
      } catch (e) {
        setError(e);
      } finally {
        setLoading(false);
      }
    };

    const fetchPlayersForSeason = async () => {
      try {
        const response = await fetch(`${API_URL}/cau-thu`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        // Assuming the API returns players grouped by season and team
        setPlayers(data);
      } catch (error) {
        console.error("Error fetching players:", error);
      }
    };

    if (selectedSeason) {
      fetchMatches();
      fetchPlayersForSeason(); // Fetch players when season changes
    }
  }, [API_URL, selectedSeason]);

  // Filter and sort matches
  const filteredAndSortedMatches = useMemo(() => {
    return matches
      .filter(
        (match) =>
          match.MaMuaGiai === selectedSeason &&
          (selectedRound === "" || match.MaVongDau === selectedRound)
      )
      .filter((match) => {
        console.log("Search query:", searchQuery)
        const query = searchQuery.toLowerCase();
        return (
          match.TenDoiBongNha.toLowerCase().includes(query) ||
          match.TenDoiBongKhach.toLowerCase().includes(query) ||
          match.TenSan.toLowerCase().includes(query) ||
          match.NgayThiDau.includes(query) ||
          match.TenVongDau.toLowerCase().includes(query)
        );
      })
      .sort((a, b) => {
        if (sortConfig.key !== null) {
          const keyA = a[sortConfig.key];
          const keyB = b[sortConfig.key];
          if (keyA < keyB) return sortConfig.direction === "ascending" ? -1 : 1;
          if (keyA > keyB) return sortConfig.direction === "ascending" ? 1 : -1;
        }
        return 0;
      });
  }, [matches, selectedSeason, selectedRound, searchQuery, sortConfig]);

  // Pagination logic
  const indexOfLastMatch = currentPage * matchesPerPage;
  const indexOfFirstMatch = indexOfLastMatch - matchesPerPage;
  const currentMatches = filteredAndSortedMatches.slice(indexOfFirstMatch, indexOfLastMatch);

  const totalPages = Math.ceil(filteredAndSortedMatches.length / matchesPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const renderPageNumbers = () => {
    const pageNumbers = [];
    for (let i = 1; i <= totalPages; i++) {
      pageNumbers.push(
        <button
          key={i}
          onClick={() => paginate(i)}
          className={currentPage === i ? styles.activePage : styles.pageButton}
        >
          {i}
        </button>
      );
    }
    return pageNumbers;
  };

  const rounds = useMemo(() => {
    return matches
      .filter(match => match.MaMuaGiai === selectedSeason)
      .map(match => ({ MaVongDau: match.MaVongDau, TenVongDau: match.TenVongDau }))
      // Ensure unique rounds
      .filter((round, index, self) =>
        index === self.findIndex((r) => r.MaVongDau === round.MaVongDau)
      )
      .sort((a, b) => parseInt(a.TenVongDau) - parseInt(b.TenVongDau)) // Sort rounds numerically
      || [];
  }, [matches, selectedSeason]);

  const handleSeasonChange = (season) => {
    setSelectedSeason(season);
    setSelectedRound("");
    setCurrentPage(1);
  };
  const handleSort = (key) => {
    setSortConfig((prev) => ({
      key,
      direction: prev.key === key && prev.direction === "ascending"
        ? "descending"
        : "ascending",
    }));
  };

  const getSortIndicator = (key) => {
    if (sortConfig.key === key) {
      return sortConfig.direction === "ascending" ? "↑" : "↓";
    }
    return "";
  };

  // Function to open the edit modal
  const handleEditMatch = (match) => {
    setEditingMatch(match);
    setIsEditModalOpen(true);
  };

  // Function to close the edit modal
  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
    setEditingMatch(null);
  };

  // Function to handle saving the edited match
  const handleSaveEditedMatch = async (updatedMatch) => {
    try {
      const response = await fetch(`${API_URL}/tran-dau/${updatedMatch.matchId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedMatch),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // Update the matches state
      setMatches(matches.map(match =>
        match.MaTranDau === updatedMatch.MaTranDau ? updatedMatch : match
      ));
      handleCloseEditModal();
    } catch (error) {
      console.error("Lỗi khi cập nhật trận đấu:", error);
      // Handle error, e.g., show a notification
    }
  };

  // Function to handle deleting a match
  const handleDeleteMatch = async (matchId) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa trận đấu này?")) {
      try {
        const response = await fetch(`${API_URL}/tran-dau/${matchId}`, {
          method: 'DELETE',
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        // Update the matches state by removing the deleted match
        setMatches(matches.filter(match => match.MaTranDau !== matchId));
      } catch (error) {
        console.error("Lỗi khi xóa trận đấu:", error);
        // Handle error, e.g., show a notification
      }
    }
  };

  if (loading) {
    return <div>Đang tải danh sách trận đấu...</div>;
  }

  if (error) {
    return <div>Lỗi khi tải dữ liệu: {error.message}</div>;
  }
  return (
    <div className={styles.matchesPage}>
      <div className={styles.filterContainer}>
        <div className={styles.seasonSelector}>
          <SeasonSelector
            onSeasonChange={handleSeasonChange}
            seasons={availableSeasons.map(season => ({ MaMuaGiai: season.MaMuaGiai, TenMuaGiai: season.TenMuaGiai }))}
            selectedSeason={selectedSeason}
            id="season"
          />
        </div>
        <div className={styles.roundSelector}>
          <select
            id="round"
            value={selectedRound}
            onChange={(e) => {
              setSelectedRound(e.target.value);
              setCurrentPage(1); // Reset page when round changes
            }}
            className={styles.selectField}
          >
            <option value="">Chọn vòng đấu</option>
            {rounds.map((round) => (
              <option key={round.MaVongDau} value={round.MaVongDau}>
                {round.TenVongDau}
              </option>
            ))}
          </select>
        </div>
        <div className={styles.searchContainer}>
          <input
            type="text"
            placeholder="Tìm kiếm trận đấu..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1); // Reset page when search query changes
            }}
            className={styles.searchField}
          />
          {searchQuery && (
            <button
              className={styles.clearButton}
              onClick={() => setSearchQuery("")}
              aria-label="Clear search"
            >
              <i className="fas fa-times"></i>
            </button>
          )}
        </div>
      </div>

      {selectedSeason === "" ? (
        <h2 className={styles.matchesTitle}>Vui lòng chọn một mùa giải</h2>
      ) : (
        <>
          <h2 className={styles.matchesTitle}>Danh sách trận đấu</h2>
          {filteredAndSortedMatches.length === 0 ? (
            <div className={styles.noMatches}>
              Không tìm thấy trận đấu nào trong mùa giải này.
            </div>
          ) : (
            <>
              <table className={styles.matchesTable}>
                <thead>
                  <tr>
                    {[
                      "Ngày thi đấu",
                      "Giờ",
                      "Đội nhà",
                      "Đội khách",
                      "Sân thi đấu",
                      "Vòng đấu",
                      "Hành động",
                    ].map(
                      (key) =>
                        key !== "Hành động" && (
                          <th
                            key={key}
                            className={styles.headerCell}
                            onClick={() => handleSort(key)}
                          >
                            {key.charAt(0).toUpperCase() + key.slice(1)}{" "}
                            {getSortIndicator(key)}
                          </th>
                        )
                    )}
                    <th key="actions" className={styles.headerCell}>
                      Hành động
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {currentMatches.map((match) => (
                    <tr
                      key={match.matchId}
                      className={styles.row}
                      onClick={() =>
                        navigate(`/tran-dau/${match.MaMuaGiai}/${match.MaVongDau}/${match.MaTranDau}`)
                      }
                    >
                      <td className={styles.cell}>{match.NgayThiDau}</td>
                      <td className={styles.cell}>{match.GioThiDau}</td>
                      <td className={styles.cell}>{match.TenDoiBongNha}</td>
                      <td className={styles.cell}>{match.TenDoiBongKhach}</td>
                      <td className={styles.cell}>{match.TenSan}</td>
                      <td className={styles.cell}>{match.TenVongDau}</td>
                      <td>
                        <button
                          className={styles.editButton}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEditMatch(match);
                          }}
                        >
                          Sửa
                        </button>
                        <button
                          className={styles.deleteButton}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteMatch(match.MaTranDau);
                          }}
                        >
                          Xóa
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {totalPages > 1 && (
                <div className={styles.pagination}>
                  {renderPageNumbers()}
                </div>
              )}
            </>
          )}
        </>
      )}

      {isEditModalOpen && editingMatch && (
        <div className={styles.modalOverlay}> {/* Lớp overlay */}
          <div className={styles.modalContent}>
            <h3 className={styles.modalTitle}>Sửa trận đấu</h3>
            {/* Pass players data as a prop to EditMatchForm */}
            <EditMatchForm
              match={editingMatch}
              onSave={handleSaveEditedMatch}
              onCancel={handleCloseEditModal}
              API_URL={API_URL}
              players={players}
            />
          </div>
        </div>
      )}
    </div>
  );
};

// Create a separate component for the Edit Match Form
const EditMatchForm = ({ match, onSave, onCancel, API_URL, players }) => {
  const [editedMatch, setEditedMatch] = useState({ ...match });
  const [availableTeams, setAvailableTeams] = useState([]);
  const [availablePlayers, setAvailablePlayers] = useState([]); // To select goal scorers
  const [goals, setGoals] = useState(match.goals || []); // State for managing goals
  const [availableStadiums, setAvailableStadiums] = useState([]);

  useEffect(() => {
    const fetchTeams = async () => {
      try {
        const response = await fetch(`${API_URL}/teams/all`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setAvailableTeams(data.teams);
      } catch (error) {
        console.error("Lỗi khi tải danh sách đội:", error);
      }
    };

    const fetchPlayers = async () => {
      try {
        const response = await fetch(`${API_URL}/players`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setAvailablePlayers(data);
      } catch (error) {
        console.error("Lỗi khi tải danh sách cầu thủ:", error);
      }
    };
    const fetchStadiums = async () => {
      try {
        const response = await fetch(`${API_URL}/stadiums`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setAvailableStadiums(data);
      } catch (error) {
        console.error("Lỗi khi tải danh sách sân vận động:", error);
      }
    };

    fetchTeams();
    // fetchPlayers(); // No need to fetch players here, it's passed as props
    fetchStadiums();
  }, [API_URL]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedMatch(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleGoalChange = (index, event) => {
    const { name, value } = event.target;
    const newGoals = [...goals];
    newGoals[index][name] = name === 'player' ? parseInt(value) : value;
    setGoals(newGoals);
  };

  const addGoal = () => {
    setGoals([...goals, { time: '', team: '', player: '' }]);
  };

  const removeGoal = (index) => {
    setGoals(goals.filter((_, i) => i !== index));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Include the goals in the updated match data
    onSave({ ...editedMatch, goals });
  };

  useEffect(() => {
    setGoals(match.goals || []);
  }, [match.goals]);

  const TeamSelect = ({ value, onChange, homeTeamId, awayTeamId }) => (
    <select name="team" value={value} onChange={onChange}>
      <option value="">Chọn đội</option>
      {availableTeams.map(team => {
        if (team.MaDoiBong === parseInt(homeTeamId)) {
          return <option key={team.MaDoiBong} value={team.MaDoiBong}>{team.TenDoiBong} (Home)</option>;
        } else if (team.MaDoiBong === parseInt(awayTeamId)) {
          return <option key={team.MaDoiBong} value={team.MaDoiBong}>{team.TenDoiBong} (Away)</option>;
        }
        return null;
      })}
    </select>
  );

  const PlayerSelect = ({ value, onChange, teamId }) => {
    const playersInTeam = Object.values(players) // Iterate through seasons
      .flatMap(seasonPlayers => Object.values(seasonPlayers)) // Iterate through teams in a season
      .flat() // Flatten the array of players
      .filter(player => player && parseInt(player.teamId) === parseInt(teamId));

    return (
      <select name="player" value={value} onChange={onChange}>
        <option value="">Chọn cầu thủ</option>
        {playersInTeam.map(player => <option key={player.id} value={player.id}>{player.name}</option>)}
      </select>
    );
  };

  return (
    <form onSubmit={handleSubmit} className={styles.editMatchForm}>
      <div className={styles.formGroup}>
        <label htmlFor="date">Ngày thi đấu:</label>
        <input type="date" id="date" name="date" value={editedMatch.NgayThiDau} onChange={handleChange} required />
      </div>
      <div className={styles.formGroup}>
        <label htmlFor="time">Giờ:</label>
        <input type="time" id="time" name="time" value={editedMatch.GioThiDau} onChange={handleChange} required />
      </div>
      <div className={styles.formGroup}>
        <label htmlFor="homeTeamId">Đội nhà:</label>
        <select id="homeTeamId" name="homeTeamId" value={editedMatch.MaDoiBongNha} onChange={handleChange} required>
          <option value="">Chọn đội nhà</option>
          {availableTeams.map(team => (
            <option key={team.MaDoiBong} value={team.MaDoiBong}>{team.TenDoiBong}</option>
          ))}
        </select>
      </div>
      <div className={styles.formGroup}>
        <label htmlFor="awayTeamId">Đội khách:</label>
        <select id="awayTeamId" name="awayTeamId" value={editedMatch.MaDoiBongKhach} onChange={handleChange} required>
          <option value="">Chọn đội khách</option>
          {availableTeams.map(team => (
            <option key={team.MaDoiBong} value={team.MaDoiBong}>{team.TenDoiBong}</option>
          ))}
        </select>
      </div>
      <div className={styles.formGroup}>
        <label htmlFor="stadiumId">Sân thi đấu:</label>
        <select id="stadiumId" name="stadiumId" value={editedMatch.MaSan} onChange={handleChange} required>
          <option value="">Chọn sân vận động</option>
          {availableStadiums.map(stadium => (
            <option key={stadium.MaSan} value={stadium.MaSan}>{stadium.TenSan}</option>
          ))}
        </select>
      </div>

      <div className={styles.formGroup}>
        <label>Bàn thắng:</label>
        {goals.map((goal, index) => (
          <div key={index} className={styles.goalEntry}>
            <input
              type="text"
              name="ThoiDiem"
              placeholder="Phút"
              value={goal.ThoiDiem}
              onChange={(e) => handleGoalChange(index, e)}
            />
            <TeamSelect
              value={goal.MaDoiBong}
              onChange={(e) => handleGoalChange(index, { target: { name: 'MaDoiBong', value: e.target.value } })}
              homeTeamId={editedMatch.MaDoiBongNha}
              awayTeamId={editedMatch.MaDoiBongKhach}
            />
            <PlayerSelect
              value={goal.MaCauThu}
              onChange={(e) => handleGoalChange(index, { target: { name: 'MaCauThu', value: e.target.value } })}
              teamId={goal.MaDoiBong}
            />
            <button type="button" onClick={() => removeGoal(index)}>Xóa</button>
          </div>
        ))}
        <button type="button" onClick={addGoal}>Thêm bàn thắng</button>
      </div>

      <div className={styles.formActions}>
        <button type="submit" className={styles.saveButton}>Lưu</button>
        <button type="button" className={styles.cancelButton} onClick={onCancel}>Hủy</button>
      </div>
    </form>
  );
};

export default Matches;