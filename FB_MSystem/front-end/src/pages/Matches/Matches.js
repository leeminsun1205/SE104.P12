import React, { useState, useMemo, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import SeasonSelector from "../../components/SeasonSelector/SeasonSelector";
import styles from "./Matches.module.css";

const Matches = ({API_URL}) => {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const seasons = useMemo(
    () => [...new Set(matches.map((match) => match.season))],
    [matches]
  );

  const [selectedSeason, setSelectedSeason] = useState("");
  const [selectedRound, setSelectedRound] = useState("");
  const [sortConfig, setSortConfig] = useState({
    key: null,
    direction: "ascending",
  });
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMatches = async () => {
      setLoading(true);
      try {
        const response = await fetch(`${API_URL}/matches`);
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

    fetchMatches();
  }, []);

  useEffect(() => {
    if (seasons.length > 0) {
      setSelectedSeason(seasons[0]);
    }
  }, [seasons]);

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
          match.date.includes(query)
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

  // Compute available rounds for the selected season
  const rounds = useMemo(() => {
    return [
      ...new Set(
        matches
          .filter((match) => match.season === selectedSeason)
          .map((match) => match.round)
      ),
    ];
  }, [matches, selectedSeason]);

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
            seasons={seasons}
            selectedSeason={selectedSeason}
            id="season"
          />
        </div>
        <div className={styles.roundSelector}>
          <label htmlFor="round" className={styles.label}>
            Vòng
          </label>
          <select
            id="round"
            value={selectedRound}
            onChange={(e) => setSelectedRound(e.target.value)}
            className={styles.selectField}
          >
            <option value="">Tất cả</option>
            {rounds.map((round) => (
              <option key={round} value={round}>
                {round}
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
          <i className={`fas fa-search ${styles.searchIcon}`}></i>
        </div>
      </div>

      {/* Matches List */}
      <h2 className={styles.matchesTitle}>Danh sách trận đấu</h2>
      <table className={styles.matchesTable}>
        <thead>
          <tr>
            {[
              "Ngày thi đấu",
              "Giờ",
              "Đội nhà",
              "Đội khách",
              "Sân thi đấu",
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
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Matches;