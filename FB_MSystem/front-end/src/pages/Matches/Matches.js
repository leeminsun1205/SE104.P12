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
  const [sortConfig, setSortConfig] = useState({
    key: null,
    direction: "ascending",
  });
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSeasons = async () => {
      try {
        const response = await fetch(`${API_URL}/seasons`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        console.log("Dữ liệu mùa giải từ API:", data);
        setAvailableSeasons(data.seasons);
      } catch (error) {
        console.error("Lỗi khi tải danh sách mùa giải:", error);
      }
    };

    fetchSeasons();
  }, [API_URL]);

  useEffect(() => {
    console.log("Danh sách mùa giải có sẵn:", availableSeasons);
    if (availableSeasons.length > 0) {
      setSelectedSeason(availableSeasons[0].id);
    }
  }, [availableSeasons]);

  useEffect(() => {
    const fetchMatches = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          `${API_URL}/matches?season=${selectedSeason}`
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

    if (selectedSeason) {
      fetchMatches();
    }
  }, [API_URL, selectedSeason]);

  // Filter and sort matches
  const filteredMatches = useMemo(() => {
    return matches
      .filter(
        (match) =>
          match.season === selectedSeason &&
          (selectedRound === "" || match.round === selectedRound)
      )
      .filter((match) => {
        const query = searchQuery.toLowerCase();
        return (
          match.homeTeamName.toLowerCase().includes(query) ||
          match.awayTeamName.toLowerCase().includes(query) ||
          match.stadiumName.toLowerCase().includes(query) ||
          match.date.includes(query) ||
          match.roundName.toLowerCase().includes(query) // Search by round name
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

  const rounds = useMemo(() => {
    const seasonData = availableSeasons.find(s => s.id === selectedSeason);
    return seasonData?.rounds?.map(round => ({ id: round.roundId, name: round.name })) || [];
  }, [availableSeasons, selectedSeason]);

  const handleSeasonChange = (season) => {
    setSelectedSeason(season);
    setSelectedRound("");
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
        {/* Season Selector */}
        <div className={styles.seasonSelector}>
          <SeasonSelector
            onSeasonChange={handleSeasonChange}
            seasons={availableSeasons.map(season => ({ id: season.id, name: season.name }))}
            selectedSeason={selectedSeason}
            id="season"
          />
        </div>
        <div className={styles.roundSelector}>
          <select
            id="round"
            value={selectedRound}
            onChange={(e) => setSelectedRound(e.target.value)}
            className={styles.selectField}
          >
            <option value="">Chọn vòng đấu</option>
            {rounds.map((round) => (
              <option key={round.id} value={round.id}>
                {round.name}
              </option>
            ))}
          </select>
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

      {selectedSeason === "" ? (
        <h2 className={styles.matchesTitle}>Vui lòng chọn một mùa giải</h2>
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
                    "Ngày thi đấu",
                    "Giờ",
                    "Đội nhà",
                    "Đội khách",
                    "Sân thi đấu",
                    "Vòng đấu", // Display round name
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
};

export default Matches;