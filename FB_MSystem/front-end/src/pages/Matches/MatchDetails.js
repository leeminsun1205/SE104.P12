import React, { useState, useMemo, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import styles from "./MatchDetails.module.css";

function MatchDetails({ API_URL }) {
  const { season, round, id } = useParams();
  const navigate = useNavigate();
  const [match, setMatch] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showGoals, setShowGoals] = useState(false);
  const [showCards, setShowCards] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [isEditingGoals, setIsEditingGoals] = useState(false);
  const [isEditingCards, setIsEditingCards] = useState(false);
  const [editedMatch, setEditedMatch] = useState(null); // Initialize to null
  const [goalSortConfig, setGoalSortConfig] = useState({
    key: null,
    direction: "ascending",
  });
  const [cardSortConfig, setCardSortConfig] = useState({
    key: null,
    direction: "ascending",
  });
  const [homeTeamPlayers, setHomeTeamPlayers] = useState([]);
  const [awayTeamPlayers, setAwayTeamPlayers] = useState([]);

  useEffect(() => {
    const fetchMatchDetails = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`${API_URL}/matches/${id}`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setMatch(data);
        setEditedMatch(data);
      } catch (e) {
        setError(e);
      } finally {
        setLoading(false);
      }
    };

    fetchMatchDetails();
  }, [API_URL, id]);

  useEffect(() => {
    const fetchTeamPlayers = async () => {
      if (match) {
        try {
          const homeResponse = await fetch(
            `${API_URL}/teams/${match.homeTeamId}/players?season=${match.season}`
          );
          if (homeResponse.ok) {
            const homeData = await homeResponse.json();
            setHomeTeamPlayers(homeData.players);
          } else {
            console.error("Failed to fetch home team players");
            setHomeTeamPlayers([]);
          }

          const awayResponse = await fetch(
            `${API_URL}/teams/${match.awayTeamId}/players?season=${match.season}`
          );
          if (awayResponse.ok) {
            const awayData = await awayResponse.json();
            setAwayTeamPlayers(awayData.players);
          } else {
            console.error("Failed to fetch away team players");
            setAwayTeamPlayers([]);
          }
        } catch (error) {
          console.error("Error fetching team players:", error);
          setHomeTeamPlayers([]);
          setAwayTeamPlayers([]);
        }
      }
    };

    fetchTeamPlayers();
  }, [match, API_URL]);

  // Sắp xếp danh sách bàn thắng
  const sortedGoals = useMemo(() => {
    const sortableGoals = editedMatch?.goals ? [...editedMatch.goals] : [];
    if (goalSortConfig.key !== null) {
      sortableGoals.sort((a, b) => {
        const aValue = a[goalSortConfig.key];
        const bValue = b[goalSortConfig.key];
        if (aValue < bValue) {
          return goalSortConfig.direction === "ascending" ? -1 : 1;
        }
        if (aValue > bValue) {
          return goalSortConfig.direction === "ascending" ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableGoals;
  }, [editedMatch?.goals, goalSortConfig]);

  // Sắp xếp danh sách thẻ phạt
  const sortedCards = useMemo(() => {
    const sortableCards = editedMatch?.cards ? [...editedMatch.cards] : [];
    if (cardSortConfig.key !== null) {
      sortableCards.sort((a, b) => {
        const aValue = a[cardSortConfig.key];
        const bValue = b[cardSortConfig.key];
        if (aValue < bValue) {
          return cardSortConfig.direction === "ascending" ? -1 : 1;
        }
        if (aValue > bValue) {
          return cardSortConfig.direction === "ascending" ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableCards;
  }, [editedMatch?.cards, cardSortConfig]);

  if (loading) {
    return <div>Đang tải thông tin trận đấu...</div>;
  }

  if (error) {
    return (
      <div className={styles.notFound}>
        <h2>Lỗi khi tải dữ liệu trận đấu</h2>
        <p>{error.message}</p>
        <button
          className={styles.backButton}
          onClick={() => navigate("/matches")}
        >
          Quay lại danh sách trận đấu
        </button>
      </div>
    );
  }

  // Nếu không tìm thấy trận đấu, hiển thị thông báo lỗi
  if (!match) {
    return (
      <div className={styles.notFound}>
        <h2>Trận đấu không tồn tại</h2>
        <p>Vui lòng kiểm tra lại thông tin.</p>
        <button
          className={styles.backButton}
          onClick={() => navigate("/matches")}
        >
          Quay lại danh sách trận đấu
        </button>
      </div>
    );
  }

  const toggleGoals = () => {
    setShowGoals(!showGoals);
  };

  const toggleCards = () => {
    setShowCards(!showCards);
  };

  const toggleResult = () => {
    setShowResult(!showResult);
  };

  const handleEditGoals = () => {
    setIsEditingGoals(true);
  };

  const handleEditCards = () => {
    setIsEditingCards(true);
  };

  const handleGoalChange = (index, field, value) => {
    const updatedGoals = editedMatch.goals.map((goal, i) =>
      i === index ? { ...goal, [field]: value } : goal
    );
    setEditedMatch({ ...editedMatch, goals: updatedGoals });
  };

  const addGoal = () => {
    setEditedMatch({
      ...editedMatch,
      goals: [
        ...(editedMatch.goals || []),
        { player: "", team: "", type: "", time: "" },
      ],
    });
  };

  const removeGoal = (index) => {
    const updatedGoals = editedMatch.goals.filter((_, i) => i !== index);
    setEditedMatch({ ...editedMatch, goals: updatedGoals });
  };

  const handleCardChange = (index, field, value) => {
    const updatedCards = editedMatch.cards.map((card, i) =>
      i === index ? { ...card, [field]: value } : card
    );
    setEditedMatch({ ...editedMatch, cards: updatedCards });
  };

  const addCard = () => {
    setEditedMatch({
      ...editedMatch,
      cards: [
        ...(editedMatch.cards || []),
        { player: "", team: "", type: "Yellow", time: "" },
      ],
    });
  };

  const removeCard = (index) => {
    const updatedCards = editedMatch.cards.filter((_, i) => i !== index);
    setEditedMatch({ ...editedMatch, cards: updatedCards });
  };

  const handleSaveGoals = async () => {
    try {
      const response = await fetch(`${API_URL}/matches/${match.matchId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ goals: editedMatch.goals }),
      });
      if (!response.ok) {
        throw new Error(`Could not update goals: ${response.statusText}`);
      }
      setMatch((prevMatch) => ({ ...prevMatch, goals: editedMatch.goals }));
      setIsEditingGoals(false);
    } catch (error) {
      console.error("Error updating goals:", error);
      // Optionally set an error state to display a message to the user
    }
  };

  const handleSaveCards = async () => {
    try {
      const response = await fetch(`${API_URL}/matches/${match.matchId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ cards: editedMatch.cards }),
      });
      if (!response.ok) {
        throw new Error(`Could not update cards: ${response.statusText}`);
      }
      setMatch((prevMatch) => ({ ...prevMatch, cards: editedMatch.cards }));
      setIsEditingCards(false);
    } catch (error) {
      console.error("Error updating cards:", error);
      // Optionally set an error state to display a message to the user
    }
  };

  const handleCancelGoals = () => {
    setIsEditingGoals(false);
    setEditedMatch(match); // Revert to original match data
  };

  const handleCancelCards = () => {
    setIsEditingCards(false);
    setEditedMatch(match); // Revert to original match data
  };

  // Sắp xếp bàn thắng theo cột
  const sortGoals = (key) => {
    let direction = "ascending";
    if (
      goalSortConfig.key === key &&
      goalSortConfig.direction === "ascending"
    ) {
      direction = "descending";
    }
    setGoalSortConfig({ key, direction });
  };

  // Sắp xếp thẻ phạt theo cột
  const sortCards = (key) => {
    let direction = "ascending";
    if (
      cardSortConfig.key === key &&
      cardSortConfig.direction === "ascending"
    ) {
      direction = "descending";
    }
    setCardSortConfig({ key, direction });
  };

  // Hiển thị mũi tên sắp xếp
  const getSortIndicator = (key, sortConfig) => {
    if (sortConfig.key === key) {
      return sortConfig.direction === "ascending" ? "↑" : "↓";
    }
    return "";
  };

  const getAvailablePlayersForTeam = (teamId) => {
    const teamIdInt = parseInt(teamId);
    if (match?.homeTeamId === teamIdInt) {
      return homeTeamPlayers;
    } else if (match?.awayTeamId === teamIdInt) {
      return awayTeamPlayers;
    }
    return [];
  };

  return (
    <div className={styles.matchDetails}>
      <h1 className={styles.matchTitle}>
        {match?.homeTeamName} <span>vs</span> {match?.awayTeamName}
      </h1>
      <div className={styles.matchInfo}>
        <div className={styles.infoItem}>
          <span className={styles.label}>Mùa giải:</span> {match?.season}
        </div>
        <div className={styles.infoItem}>
          <span className={styles.label}>Vòng đấu:</span> {match?.roundName}
        </div>
        <div className={styles.infoItem}>
          <span className={styles.label}>Ngày:</span> {match?.date}
        </div>
        <div className={styles.infoItem}>
          <span className={styles.label}>Giờ:</span> {match?.time}
        </div>
        <div className={styles.infoItem}>
          <span className={styles.label}>
            Sân vận động:
          </span>{" "}
          {match?.stadiumName}
        </div>
      </div>

      {/* Buttons để hiện/ẩn thông tin chi tiết */}
      {match?.isFinished && (
        <div>
          <button className={styles.smallDetailsButton} onClick={toggleResult}>
            {showResult ? "Ẩn kết quả trận đấu" : "Hiện kết quả trận đấu"}
          </button>
        </div>
      )}

      {/* Thông tin chi tiết trận đấu */}
      {match?.isFinished && showResult && (
        <div className={styles.matchDetailsContainer}>
          <table className={styles.matchDetailsTable}>
            <tbody>
              <tr>
                <td>
                  <span className={styles.label}>Đội 1:</span>{" "}
                  {match?.homeTeamName}
                </td>
                <td>
                  <span className={styles.label}>Đội 2:</span>{" "}
                  {match?.awayTeamName}
                </td>
              </tr>
              <tr>
                <td>
                  <span className={styles.label}>Tỷ số:</span>{" "}
                  {match?.homeScore} - {match?.awayScore}
                </td>
                <td>
                  <span className={styles.label}>Sân đấu:</span>{" "}
                  {match?.stadiumName}
                </td>
              </tr>
              <tr>
                <td>
                  <span className={styles.label}>Ngày:</span> {match?.date}
                </td>
                <td>
                  <span className={styles.label}>Thời gian:</span>{" "}
                  {match?.time}
                </td>
              </tr>
              <tr>
                <td colSpan="2">
                  <div className={styles.toggleButtonsContainer}>
                    <button
                      className={styles.smallDetailsButton}
                      onClick={toggleGoals}
                    >
                      {showGoals ? "Ẩn bàn thắng" : "Hiện bàn thắng"}
                    </button>
                    <button
                      className={styles.smallDetailsButton}
                      onClick={toggleCards}
                    >
                      {showCards ? "Ẩn thẻ phạt" : "Hiện thẻ phạt"}
                    </button>
                  </div>
                  {/* Edit section for goals */}
                  <div className={styles.editSection}>
                    {showGoals && !isEditingGoals && (
                      <button
                        className={styles.editButton}
                        onClick={handleEditGoals}
                      >
                        Chỉnh sửa bàn thắng
                      </button>
                    )}
                  </div>
                  {/* Bảng thông tin bàn thắng */}
                  {showGoals && (
                    <div>
                      <span className={styles.label}>Bàn thắng:</span>
                      <table className={styles.goalTable}>
                        <thead>
                          <tr>
                            <th onClick={() => sortGoals("player")}>
                              Cầu thủ{" "}
                              {getSortIndicator("player", goalSortConfig)}
                            </th>
                            <th>Đội</th>
                            <th onClick={() => sortGoals("type")}>
                              Loại bàn thắng{" "}
                              {getSortIndicator("type", goalSortConfig)}
                            </th>
                            <th onClick={() => sortGoals("time")}>
                              Thời điểm ghi bàn{" "}
                              {getSortIndicator("time", goalSortConfig)}
                            </th>
                            {isEditingGoals && <th>Hành động</th>}
                          </tr>
                        </thead>
                        <tbody>
                          {sortedGoals.map((goal, index) => (
                            <tr key={`goal-${index}`}>
                              <td>
                                {isEditingGoals ? (
                                  <select
                                    value={goal.player}
                                    onChange={(e) =>
                                      handleGoalChange(
                                        index,
                                        "player",
                                        e.target.value
                                      )
                                    }
                                  >
                                    <option value="">Chọn cầu thủ</option>
                                    {getAvailablePlayersForTeam(
                                      goal.team === match.homeTeamName
                                        ? match.homeTeamId
                                        : match.awayTeamId
                                    ).map((player) => (
                                      <option key={player.id} value={player.name}>
                                        {player.name}
                                      </option>
                                    ))}
                                  </select>
                                ) : (
                                  goal.player
                                )}
                              </td>
                              <td>
                                {isEditingGoals ? (
                                  <select
                                    value={goal.team}
                                    onChange={(e) =>
                                      handleGoalChange(
                                        index,
                                        "team",
                                        e.target.value
                                      )
                                    }
                                  >
                                    <option value={match.homeTeamName}>
                                      {match.homeTeamName}
                                    </option>
                                    <option value={match.awayTeamName}>
                                      {match.awayTeamName}
                                    </option>
                                  </select>
                                ) : (
                                  goal.team
                                )}
                              </td>
                              <td>
                                {isEditingGoals ? (
                                  <input
                                    type="text"
                                    value={goal.type}
                                    onChange={(e) =>
                                      handleGoalChange(
                                        index,
                                        "type",
                                        e.target.value
                                      )
                                    }
                                  />
                                ) : (
                                  goal.type
                                )}
                              </td>
                              <td>
                                {isEditingGoals ? (
                                  <input
                                    type="text"
                                    value={goal.time}
                                    onChange={(e) =>
                                      handleGoalChange(
                                        index,
                                        "time",
                                        e.target.value
                                      )
                                    }
                                  />
                                ) : (
                                  goal.time
                                )}
                              </td>
                              {isEditingGoals && (
                                <td>
                                  <button
                                    type="button"
                                    onClick={() => removeGoal(index)}
                                    className={styles.removeButton}
                                  >
                                    Xóa
                                  </button>
                                </td>
                              )}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                      {isEditingGoals && (
                        <button
                          type="button"
                          onClick={addGoal}
                          className={styles.addButton}
                        >
                          Thêm bàn thắng
                        </button>
                      )}
                      {/* Save and Cancel buttons for goals */}
                      {isEditingGoals && (
                        <div className={styles.editButtonGroup}>
                          <button
                            className={styles.saveButton}
                            onClick={handleSaveGoals}
                          >
                            Lưu thay đổi
                          </button>
                          <button
                            className={styles.cancelButton}
                            onClick={handleCancelGoals}
                          >
                            Hủy
                          </button>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Edit section for cards */}
                  <div className={styles.editSection}>
                    {showCards && !isEditingCards && (
                      <button
                        className={styles.editButton}
                        onClick={handleEditCards}
                      >
                        Chỉnh sửa thẻ phạt
                      </button>
                    )}
                  </div>

                  {/* Bảng thông tin thẻ phạt */}
                  {showCards && (
                    <div>
                      <span className={styles.label}>Thẻ phạt:</span>
                      <table className={styles.cardTable}>
                        <thead>
                          <tr>
                            <th onClick={() => sortCards("player")}>
                              Cầu thủ{" "}
                              {getSortIndicator("player", cardSortConfig)}
                            </th>
                            <th>Đội</th>
                            <th onClick={() => sortCards("type")}>
                              Loại thẻ{" "}
                              {getSortIndicator("type", cardSortConfig)}
                            </th>
                            <th onClick={() => sortCards("time")}>
                              Thời điểm{" "}
                              {getSortIndicator("time", cardSortConfig)}
                            </th>
                            {isEditingCards && <th>Hành động</th>}
                          </tr>
                        </thead>
                        <tbody>
                          {sortedCards.map((card, index) => (
                            <tr key={`card-${index}`}>
                              <td>
                                {isEditingCards ? (
                                  <select
                                    value={card.player}
                                    onChange={(e) =>
                                      handleCardChange(
                                        index,
                                        "player",
                                        e.target.value
                                      )
                                    }
                                  >
                                    <option value="">Chọn cầu thủ</option>
                                    {getAvailablePlayersForTeam(
                                      card.team === match.homeTeamName
                                        ? match.homeTeamId
                                        : match.awayTeamId
                                    ).map((player) => (
                                      <option key={player.id} value={player.name}>
                                        {player.name}
                                      </option>
                                    ))}
                                  </select>
                                ) : (
                                  card.player
                                )}
                              </td>
                              <td>
                                {isEditingCards ? (
                                  <select
                                    value={card.team}
                                    onChange={(e) =>
                                      handleCardChange(
                                        index,
                                        "team",
                                        e.target.value
                                      )
                                    }
                                  >
                                    <option value={match.homeTeamName}>
                                      {match.homeTeamName}
                                    </option>
                                    <option value={match.awayTeamName}>
                                      {match.awayTeamName}
                                    </option>
                                  </select>
                                ) : (
                                  card.team
                                )}
                              </td>
                              <td>
                                {isEditingCards ? (
                                  <select
                                    value={card.type}
                                    onChange={(e) =>
                                      handleCardChange(
                                        index,
                                        "type",
                                        e.target.value
                                      )
                                    }
                                  >
                                    <option value="Yellow">Thẻ vàng</option>
                                    <option value="Red">Thẻ đỏ</option>
                                  </select>
                                ) : card.type === "Red" ? (
                                  <span className={styles.redCard}>Thẻ đỏ</span>
                                ) : (
                                  <span className={styles.yellowCard}>
                                    Thẻ vàng
                                  </span>
                                )}
                              </td>
                              <td>
                                {isEditingCards ? (
                                  <input
                                    type="text"
                                    value={card.time}
                                    onChange={(e) =>
                                      handleCardChange(
                                        index,
                                        "time",
                                        e.target.value
                                      )
                                    }
                                  />
                                ) : (
                                  card.time
                                )}
                              </td>
                              {isEditingCards && (
                                <td>
                                  <button
                                    type="button"
                                    onClick={() => removeCard(index)}
                                    className={styles.removeButton}
                                  >
                                    Xóa
                                  </button>
                                </td>
                              )}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                      {isEditingCards && (
                        <button
                          type="button"
                          onClick={addCard}
                          className={styles.addButton}
                        >
                          Thêm thẻ phạt
                        </button>
                      )}
                      {/* Save and Cancel buttons for cards */}
                      {isEditingCards && (
                        <div className={styles.editButtonGroup}>
                          <button
                            className={styles.saveButton}
                            onClick={handleSaveCards}
                          >
                            Lưu thay đổi
                          </button>
                          <button
                            className={styles.cancelButton}
                            onClick={handleCancelCards}
                          >
                            Hủy
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      )}
      <button
        className={styles.backButton}
        onClick={() => navigate("/matches")}
      >
        Quay lại danh sách trận đấu
      </button>
    </div>
  );
}

export default MatchDetails;