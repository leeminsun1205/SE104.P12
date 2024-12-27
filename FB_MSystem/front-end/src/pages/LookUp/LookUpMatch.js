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
    key: "date",
    direction: "ascending",
  });
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTeams = async () => {
      try {
        const response = await fetch(`${API_URL}/doi-bong`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        console.log("Dữ liệu đội bóng từ API:", data);
        setAvailableTeams(data.teams);
      } catch (error) {
        console.error("Lỗi khi tải danh sách đội bóng:", error);
      }
    };

    fetchTeams();
  }, [API_URL]);

  useEffect(() => {
    console.log("Danh sách mùa giải có sẵn:", availableTeams);
    if (availableTeams.length > 0) {
      setSelectedTeam(availableTeams[0].id);
    }
  }, [availableTeams]);

  useEffect(() => {
    const fetchMatches = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          `${API_URL}/matches?team=${selectedTeam}`
        );
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setMatches(data);
      } catch (e) {
        setError(e);
      } finally {
        setLoading(false);
      }
    };

    if (selectedTeam) {
      fetchMatches();
    }
  }, [API_URL, selectedTeam]);

  // Filter and sort matches
  const filteredMatches = useMemo(() => {
    return matches
      .filter(
        (match) =>
          match.homeTeamId === parseInt(selectedTeam, 10) || match.awayTeamId === parseInt(selectedTeam, 10)
      )
      .filter((match) => {
        const query = searchQuery.toLowerCase();
        return (
            match.homeTeamName.toLowerCase().includes(query) ||
            match.awayTeamName.toLowerCase().includes(query) ||
            match.stadiumName.toLowerCase().includes(query) ||
            match.date.includes(query) ||
            match.roundName.toLowerCase().includes(query) 
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

  const handleTeamsChange = (team) => {
    setSelectedTeam(team);
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

  if (error) {
    return <div>Lỗi khi tải dữ liệu: {error.message}</div>;
  }

  return (
    <div className={styles.matchesPage}>
      <div className={styles.filterContainer}>
        {/* Teams Selector */}
        <div className={styles.TeamSelector}>
          <TeamSelector
            onTeamsChange={handleTeamsChange}
            teams={availableTeams.map(teams => ({ id: teams.id, name: teams.name }))}
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
          {filteredMatches.length === 0 ? (
            <div className={styles.noMatches}>
              Không tìm thấy trận đấu nào trong mùa giải này.
            </div>
          ) : (
            <table className={styles.matchesTable}>
              <thead>
                <tr>
                  {[
                    "date",
                    "time",
                    "homeTeamName",
                    "awayTeamName",
                    "stadiumName",
                    "roundName", // Display round name
                    "actions",
                  ].map(
                    (key) =>
                      key !== "actions" && (
                        <th
                          key={key}
                          className={styles.headerCell}
                          onClick={() => handleSort(key)}
                        >
                          {key === 'date' ? 'Ngày thi đấu' :
                           key === 'time' ? 'Giờ' :
                           key === 'homeTeamName' ? 'Đội nhà' :
                           key === 'awayTeamName' ? 'Đội khách' :
                           key === 'stadiumName' ? 'Sân thi đấu' :
                           key === 'roundName' ? 'Vòng đấu' : ''
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
                    key={match.matchId}
                    className={styles.row}
                    onClick={() =>
                      navigate(`/match/${match.season}/${match.round}/${match.matchId}`)
                    }
                  >
                    <td className={styles.cell}>{match.date}</td>
                    <td className={styles.cell}>{match.time}</td>
                    <td className={styles.cell}>{match.homeTeamName}</td>
                    <td className={styles.cell}>{match.awayTeamName}</td>
                    <td className={styles.cell}>{match.stadiumName}</td>
                    <td className={styles.cell}>{match.roundName}</td> {/* Display round name */}
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