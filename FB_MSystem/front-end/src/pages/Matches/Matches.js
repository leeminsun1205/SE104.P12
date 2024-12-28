import React, { useState, useMemo, useEffect, useCallback } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import SeasonSelector from "../../components/SeasonSelector/SeasonSelector";
import MatchForm from "./MatchForm"; // Import the MatchForm component
import styles from "./Matches.module.css";

const Matches = ({ API_URL }) => {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [availableSeasons, setAvailableSeasons] = useState([]);
  const [selectedSeason, setSelectedSeason] = useState("");
  const [selectedRound, setSelectedRound] = useState("");
  const [players, setPlayers] = useState({});
  const [sortConfig, setSortConfig] = useState({
    key: null,
    direction: "ascending",
  });
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  const [currentPage, setCurrentPage] = useState(1);
  const matchesPerPage = 4;
  const maxVisiblePages = 5;

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingMatch, setEditingMatch] = useState(null);
  const [editingMatchGoals, setEditingMatchGoals] = useState([]);
  const [availableTeams, setAvailableTeams] = useState([]);
  const [teamPlayers, setTeamPlayers] = useState({});
  const [availableStadiums, setAvailableStadiums] = useState([]);

  // Fetch available seasons
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

  // Set initial selected season
  useEffect(() => {
    if (availableSeasons.length > 0) {
      setSelectedSeason(availableSeasons[0].MaMuaGiai);
    }
  }, [availableSeasons]);

  useEffect(() => {
    const fetchMatches = async () => {
      setLoading(true);
      setError(null); // Reset error on new fetch
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
        const response = await fetch(
          `${API_URL}/mg-db/mua-giai/${selectedSeason}/doi-bong`
        );
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        const playersByTeam = {};
        data.forEach((teamData) => {
          playersByTeam[teamData.MaDoiBong] = teamData.maCauThu;
        });
        setPlayers(playersByTeam);
      } catch (error) {
        console.error("Error fetching players for season:", error);
      }
    };

    if (selectedSeason) {
      fetchMatches();
      fetchPlayersForSeason();
    }
  }, [API_URL, selectedSeason]);

  // Fetch teams and stadiums for the edit modal
  useEffect(() => {
    const fetchTeams = async () => {
      try {
        const response = await fetch(`${API_URL}/doi-bong`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setAvailableTeams(data.doiBong);
      } catch (error) {
        console.error("Lỗi khi tải danh sách đội:", error);
      }
    };

    const fetchStadiums = async () => {
      try {
        const response = await fetch(`${API_URL}/san-thi-dau`);
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
    fetchStadiums();
  }, [API_URL]);

  // Fetch players for teams in the edit modal
  const fetchPlayersByTeam = useCallback(async (maDoiBong) => {
    try {
      const response = await fetch(
        `${API_URL}/db-ct/doi-bong/${maDoiBong}/cau-thu/${selectedSeason}`
      );
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setTeamPlayers((prev) => ({ ...prev, [maDoiBong]: data.cauThu }));
    } catch (error) {
      console.error(
        `Lỗi khi tải danh sách cầu thủ cho đội ${maDoiBong}:`,
        error
      );
      setTeamPlayers((prev) => ({ ...prev, [maDoiBong]: [] }));
    }
  }, [API_URL, selectedSeason]);

  // Filter and sort matches
  const filteredAndSortedMatches = useMemo(() => {
    return matches
      .filter(
        (match) =>
          match.VongDau.MaMuaGiai === selectedSeason &&
          (selectedRound === "" || match.VongDau.MaVongDau === selectedRound)
      )
      .filter((match) => {
        const query = searchQuery.toLowerCase();
        return (
          match.DoiBongNha.TenDoiBong.toLowerCase().includes(query) ||
          match.DoiBongKhach.TenDoiBong.toLowerCase().includes(query) ||
          match.SanThiDau.TenSan.toLowerCase().includes(query) ||
          (match.NgayThiDau && match.NgayThiDau.includes(query)) ||
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
  const currentMatches = useMemo(() => filteredAndSortedMatches.slice(indexOfFirstMatch, indexOfLastMatch), [filteredAndSortedMatches, indexOfFirstMatch, indexOfLastMatch]);

  const totalPages = Math.ceil(filteredAndSortedMatches.length / matchesPerPage);

  const paginate = useCallback((pageNumber) => setCurrentPage(pageNumber), []);

  const renderPageNumbers = useMemo(() => {
    const pageNumbers = [];
    if (totalPages <= maxVisiblePages) {
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
    } else {
      let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
      let endPage = Math.min(totalPages, currentPage + Math.floor((maxVisiblePages - 1) / 2));

      if (endPage - startPage + 1 < maxVisiblePages) {
        if (startPage === 1) {
          endPage = Math.min(totalPages, maxVisiblePages);
        } else {
          startPage = Math.max(1, totalPages - maxVisiblePages + 1);
        }
      }

      if (startPage > 1) {
        pageNumbers.push(
          <button
            key="prev-dots"
            className={styles.pageButton}
          >
            ...
          </button>
        );
      }

      for (let i = startPage; i <= endPage; i++) {
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

      if (endPage < totalPages) {
        pageNumbers.push(
          <button
            key="next-dots"
            className={styles.pageButton}
          >
            ...
          </button>
        );
      }
    }
    return pageNumbers;
  }, [currentPage, paginate, totalPages, styles.activePage, styles.pageButton, maxVisiblePages]);

  const rounds = useMemo(() => {
    return matches
      .filter((match) => match.VongDau.MaMuaGiai === selectedSeason)
      .filter(
        (round, index, self) =>
          index ===
          self.findIndex(
            (r) => r.VongDau.MaVongDau === round.VongDau.MaVongDau
          )
      )
      .sort((a, b) => parseInt(a.TenVongDau) - parseInt(b.TenVongDau)) || [];
  }, [matches, selectedSeason]);

  const handleSeasonChange = useCallback(
    (season) => {
      setSelectedSeason(season);
      setSelectedRound("");
      setCurrentPage(1);
    },
    []
  );

  const handleSort = useCallback((key) => {
    setSortConfig((prev) => ({
      key,
      direction:
        prev.key === key && prev.direction === "ascending"
          ? "descending"
          : "ascending",
    }));
  }, []);

  const getSortIndicator = useCallback(
    (key) => {
      if (sortConfig.key === key) {
        return sortConfig.direction === "ascending" ? "↑" : "↓";
      }
      return "";
    },
    [sortConfig.direction, sortConfig.key]
  );

  // Function to open the edit modal
  const handleEditMatch = useCallback(async (match) => {
    setEditingMatch(match);
    setIsEditModalOpen(true);
    try {
      const response = await fetch(`${API_URL}/ban-thang/tran-dau/${match.MaTranDau}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setEditingMatchGoals(data.banThang || []);
    } catch (error) {
      console.error("Lỗi khi tải danh sách bàn thắng:", error);
      setEditingMatchGoals([]);
    }
    if (match.MaDoiBongNha) fetchPlayersByTeam(match.MaDoiBongNha);
    if (match.MaDoiBongKhach) fetchPlayersByTeam(match.MaDoiBongKhach);
  }, [API_URL, fetchPlayersByTeam]);

  // Function to close the edit modal
  const handleCloseEditModal = useCallback(() => {
    setIsEditModalOpen(false);
    setEditingMatch(null);
    setEditingMatchGoals([]);
  }, []);

  const handleAddGoal = useCallback(() => {
    setEditingMatchGoals([...editingMatchGoals, { ThoiDiem: "", MaDoiBong: "", MaCauThu: "" }]);
  }, [editingMatchGoals]);

  const handleGoalChange = useCallback((index, event) => {
    const { name, value } = event.target;
    const newGoals = [...editingMatchGoals];
    newGoals[index][name] = value;
    setEditingMatchGoals(newGoals);
  }, [editingMatchGoals]);

  const handleRemoveGoal = useCallback((index) => {
    setEditingMatchGoals(editingMatchGoals.filter((_, i) => i !== index));
  }, [editingMatchGoals]);

  const handleSaveEditedMatch = useCallback(async (updatedMatch) => {
    try {
      const response = await fetch(
        `${API_URL}/tran-dau/${updatedMatch.MaTranDau}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            MaTranDau: updatedMatch.MaTranDau,
            BanThangDoiNha: updatedMatch.BanThangDoiNha,
            BanThangDoiKhach: updatedMatch.BanThangDoiKhach,
            NgayThiDau: updatedMatch.NgayThiDau,
            GioThiDau: updatedMatch.GioThiDau,
            MaSan: updatedMatch.MaSan,
            MaVongDau: updatedMatch.MaVongDau,
            MaMuaGiai: updatedMatch.MaMuaGiai,
            MaDoiBongNha: updatedMatch.MaDoiBongNha,
            MaDoiBongKhach: updatedMatch.MaDoiBongKhach,
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error saving match: ${response.status}`);
      }

      // Save goal details
      for (const goal of editingMatchGoals) {
        const goalResponse = await fetch(`${API_URL}/ban-thang`, {
          method: goal.MaBanThang ? "PUT" : "POST", // Assuming MaBanThang exists for existing goals
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...goal, MaTranDau: updatedMatch.MaTranDau }),
        });
        if (!goalResponse.ok) {
          throw new Error(`HTTP error saving goal: ${goalResponse.status}`);
        }
      }

      setMatches((prevMatches) =>
        prevMatches.map((match) =>
          match.MaTranDau === updatedMatch.MaTranDau ? { ...match, ...updatedMatch } : match
        )
      );
      handleCloseEditModal();
    } catch (error) {
      console.error("Lỗi khi cập nhật trận đấu:", error);
    }
  }, [API_URL, handleCloseEditModal, editingMatchGoals]);

  const TeamSelect = useCallback(({ value, onChange }) => (
    <select name="MaDoiBong" value={value} onChange={onChange}>
      <option value="">Chọn đội</option>
      {availableTeams.map((team) => (
        <option key={team.MaDoiBong} value={team.MaDoiBong}>
          {team.TenDoiBong}
        </option>
      ))}
    </select>
  ), [availableTeams]);

  const PlayerSelect = useCallback(({ value, onChange, teamId }) => {
    const playersInTeam = teamPlayers[teamId] || [];

    return (
      <select name="MaCauThu" value={value} onChange={onChange}>
        <option value="">Chọn cầu thủ</option>
        {playersInTeam.map((player) => (
          <option key={player.MaCauThu} value={player.MaCauThu}>
            {player.TenCauThu}
          </option>
        ))}
      </select>
    );
  }, [teamPlayers]);

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
            seasons={availableSeasons.map((season) => ({
              MaMuaGiai: season.MaMuaGiai,
              TenMuaGiai: season.TenMuaGiai,
            }))}
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
              setCurrentPage(1);
            }}
            className={styles.selectField}
          >
            <option value="">Chọn vòng đấu</option>
            {rounds.map((round) => (
              <option key={round.VongDau.MaVongDau} value={round.VongDau.MaVongDau}>
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
              setCurrentPage(1);
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
                    {["Ngày thi đấu", "Giờ", "Đội nhà", "Đội khách", "Sân thi đấu", "Vòng đấu", "Hành động"].map(
                      (key) =>
                        key !== "Hành động" ? (
                          <th key={key} className={styles.headerCell} onClick={() => handleSort(key)}>
                            {key.charAt(0).toUpperCase() + key.slice(1)} {getSortIndicator(key)}
                          </th>
                        ) : (
                          <th key="actions" className={styles.headerCell}>
                            Hành động
                          </th>
                        )
                    )}
                  </tr>
                </thead>
                <tbody>
                  {currentMatches.map((match) => (
                    <tr
                      key={match.MaTranDau}
                      className={styles.row}
                      onClick={() =>
                        navigate(
                          `/tran-dau/${match.VongDau.MaMuaGiai}/${match.VongDau.MaVongDau}/${match.MaTranDau}`
                        )
                      }
                    >
                      <td className={styles.cell}>{match.NgayThiDau}</td>
                      <td className={styles.cell}>{match.GioThiDau}</td>
                      <td className={styles.cell}>{match.DoiBongNha.TenDoiBong}</td>
                      <td className={styles.cell}>{match.DoiBongKhach.TenDoiBong}</td>
                      <td className={styles.cell}>{match.SanThiDau.TenSan}</td>
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
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {totalPages > 1 && (
                <div className={styles.paginationContainer}>
                  {renderPageNumbers}
                </div>
              )}
            </>
          )}
        </>
      )}

      {isEditModalOpen && editingMatch && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <h3 className={styles.modalTitle}>Sửa trận đấu</h3>
            <MatchForm
              match={editingMatch}
              onSave={handleSaveEditedMatch}
              onCancel={handleCloseEditModal}
              API_URL={API_URL}
              players={players}
              availableTeams={availableTeams}
              availableStadiums={availableStadiums}
            />

            <div className={styles.formGroup}>
              <label>Bàn thắng:</label>
              {editingMatchGoals.map((goal, index) => (
                <div key={index} className={styles.goalEntry}>
                  <input
                    type="text"
                    name="ThoiDiem"
                    placeholder="Phút"
                    value={goal.ThoiDiem || ""}
                    onChange={(e) => handleGoalChange(index, e)}
                  />
                  <TeamSelect
                    value={goal.MaDoiBong || ""}
                    onChange={(e) => handleGoalChange(index, { target: { name: "MaDoiBong", value: e.target.value } })}
                  />
                  <PlayerSelect
                    value={goal.MaCauThu || ""}
                    onChange={(e) => handleGoalChange(index, { target: { name: "MaCauThu", value: e.target.value } })}
                    teamId={goal.MaDoiBong}
                  />
                  <button type="button" onClick={() => handleRemoveGoal(index)}>
                    Xóa
                  </button>
                </div>
              ))}
              <button type="button" onClick={handleAddGoal}>
                Thêm bàn thắng
              </button>
            </div>

            <div className={styles.formActions}>
              <button type="button" className={styles.cancelButton} onClick={handleCloseEditModal}>
                Hủy
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Matches;