import React, { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import TeamSelector from "../../components/TeamSelector.js/TeamSelector";
import styles from "./LookUpMatch.module.css";

function LookUpMatch({ API_URL }) {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [availableTeams, setAvailableTeams] = useState([]);
  const [selectedTeam, setSelectedTeam] = useState("");
  const [sortConfig, setSortConfig] = useState({
    key: "NgayThiDau",
    direction: "ascending",
  });
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();
  const [hasUserInteracted, setHasUserInteracted] = useState(false); // Flag to track user interaction

  useEffect(() => {
    const fetchTeams = async () => {
      try {
        const response = await fetch(`${API_URL}/doi-bong`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        console.log("Dữ liệu đội bóng từ API:", data);
        setAvailableTeams(data.doiBong);
      } catch (error) {
        console.error("Lỗi khi tải danh sách đội bóng:", error);
      }
    };

    fetchTeams();
  }, [API_URL]);

  useEffect(() => {
    console.log("Danh sách đội bóng có sẵn:", availableTeams);
    if (availableTeams.length > 0 && !selectedTeam) {
      const trySetDefaultTeam = async () => {
        for (const team of availableTeams) {
          try {
            setLoading(true);
            setError(null);
            const response = await fetch(`${API_URL}/tran-dau/doi-bong/${team.MaDoiBong}`);
            if (response.ok) {
              console.log(`Đã chọn đội mặc định: ${team.TenDoiBong}`);
              setSelectedTeam(team.MaDoiBong);
              return; // Exit the loop once a valid team is found
            } else {
              console.warn(`Lỗi khi tải trận đấu cho đội ${team.TenDoiBong} (mặc định): ${response.status}`);
            }
          } catch (err) {
            console.error(`Lỗi khi tải trận đấu cho đội ${team.TenDoiBong} (mặc định):`, err);
          } finally {
            setLoading(false);
          }
        }
        console.log("Không có đội mặc định nào được chọn do lỗi.");
      };
      trySetDefaultTeam();
    }
  }, [availableTeams, API_URL, selectedTeam]);

  useEffect(() => {
    if (selectedTeam) {
      console.log("useEffect fetchMatches được gọi với selectedTeam:", selectedTeam);
      const fetchMatches = async () => {
        setLoading(true);
        setError(null);
        try {
          const response = await fetch(
            `${API_URL}/tran-dau/doi-bong/${selectedTeam}`
          );
          if (!response.ok) {
            if (response.status === 404 && hasUserInteracted) {
              setError("Không có thông tin trận đấu về đội bóng này.");
            } else if (response.status !== 404) {
              throw new Error(`HTTP error! status: ${response.status}`);
            }
            setMatches([]); // Clear matches on error
          } else {
            const data = await response.json();
            console.log("Dữ liệu trận đấu từ API:", data);
            setMatches(data.tranDau);
            setError(null);
          }
        } catch (e) {
          setError("Lỗi khi tải thông tin trận đấu.");
          setMatches([]);
        } finally {
          setLoading(false);
        }
      };
      fetchMatches();
    } else {
      setMatches([]);
      setError(null); // Clear any previous errors when no team is selected
    }
  }, [API_URL, selectedTeam, hasUserInteracted]);

  const filteredMatches = useMemo(() => {
    console.log("Giá trị matches trong filteredMatches:", matches);
    console.log("Giá trị selectedTeam trong filteredMatches:", selectedTeam);
    return matches
      .filter((match) =>
        selectedTeam ? match.DoiBongNha.MaDoiBong === selectedTeam || match.DoiBongKhach.MaDoiBong === selectedTeam : false
      )
      .filter((match) => {
        const query = searchQuery.toLowerCase();
        return (
          match.DoiBongNha.TenDoiBong.toLowerCase().includes(query) ||
          match.DoiBongKhach.TenDoiBong.toLowerCase().includes(query) ||
          match.SanThiDau.TenSan.toLowerCase().includes(query) ||
          match.NgayThiDau.includes(query) ||
          match.VongDau.MaVongDau.toLowerCase().includes(query)
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
  }, [matches, selectedTeam, searchQuery, sortConfig]);

  const handleTeamsChange = (teamId) => {
    console.log("Đội được chọn:", teamId);
    setSelectedTeam(teamId);
    setHasUserInteracted(true); // Set the flag when the user interacts
    setError(null); // Clear any previous errors when a new team is selected
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

  if (loading) {
    return <div>Đang tải danh sách trận đấu...</div>;
  }

  return (
    <div className={styles.matchesPage}>
      <div className={styles.filterContainer}>
        {/* Teams Selector */}
        <div className={styles.TeamSelector}>
          <TeamSelector
            onTeamsChange={handleTeamsChange}
            teams={availableTeams.map(team => ({ id: team.MaDoiBong, name: team.TenDoiBong }))}
            selectedTeam={selectedTeam}
            id="teams"
          />
        </div>
        <div className={styles.searchContainer}>
          <input
            type="text"
            placeholder="Tìm kiếm trận đấu..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
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

      {selectedTeam === "" ? (
        <h2 className={styles.matchesTitle}>Vui lòng chọn một đội bóng</h2>
      ) : (
        <>
          <h2 className={styles.matchesTitle}>Danh sách trận đấu</h2>
          {error ? (
            <div className={styles.noMatches}>{error}</div>
          ) : filteredMatches.length === 0 && !loading ? (
            <div className={styles.noMatches}>Không có thông tin trận đấu về đội bóng này.</div>
          ) : (
            <table className={styles.matchesTable}>
              <thead>
                <tr>
                  {[
                    "NgayThiDau",
                    "GioThiDau",
                    "DoiBongNha",
                    "DoiBongKhach",
                    "SanThiDau",
                    "VongDau",
                    "actions",
                  ].map(
                    (key) =>
                      key !== "actions" && (
                        <th
                          key={key}
                          className={styles.headerCell}
                          onClick={() => handleSort(key)}
                        >
                          {key === 'NgayThiDau' ? 'Ngày thi đấu' :
                           key === 'GioThiDau' ? 'Giờ' :
                           key === 'DoiBongNha' ? 'Đội nhà' :
                           key === 'DoiBongKhach' ? 'Đội khách' :
                           key === 'SanThiDau' ? 'Sân thi đấu' :
                           key === 'VongDau' ? 'Vòng đấu' : ''
                          }
                          {" "}
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
                {filteredMatches.map((match) => (
                  <tr
                    key={match.MaTranDau}
                    className={styles.row}
                    onClick={() =>
                      navigate(`/match/${match.VongDau.MaMuaGiai}/${match.VongDau.MaVongDau}/${match.MaTranDau}`)
                    }
                  >
                    <td className={styles.cell}>{match.NgayThiDau}</td>
                    <td className={styles.cell}>{match.GioThiDau}</td>
                    <td className={styles.cell}>{match.DoiBongNha.TenDoiBong}</td>
                    <td className={styles.cell}>{match.DoiBongKhach.TenDoiBong}</td>
                    <td className={styles.cell}>{match.SanThiDau.TenSan}</td>
                    <td className={styles.cell}>{match.VongDau.MaVongDau}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </>
      )}
    </div>
  );
}

export default LookUpMatch;