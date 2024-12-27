import React, { useState, useMemo, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import styles from "./MatchDetails.module.css";

function MatchDetails({ API_URL }) {
  const { MaMuaGiai, MaVongDau, MaTranDau } = useParams();
  const navigate = useNavigate();
  const [match, setMatch] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showGoals, setShowGoals] = useState(false);
  const [showCards, setShowCards] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [isEditingGoals, setIsEditingGoals] = useState(false);
  const [isEditingCards, setIsEditingCards] = useState(false);
  const [editedMatch, setEditedMatch] = useState(null);
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
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const matchResponse = await fetch(`${API_URL}/tran-dau/${MaTranDau}`);
        if (!matchResponse.ok)
          throw new Error(`HTTP error! status: ${matchResponse.status}`);
        const matchData = await matchResponse.json();
        setMatch(matchData);
        setEditedMatch(matchData);

        const homeResponse = await fetch(
          `${API_URL}/teams/${matchData.MaDoiBongNha}/players?season=${matchData.MaMuaGiai}`
        );
        if (!homeResponse.ok)
          console.error("Failed to fetch home team players");
        const homeData = await homeResponse.json();
        setHomeTeamPlayers(homeData.players);

        const awayResponse = await fetch(
          `${API_URL}/teams/${matchData.MaDoiBongKhach}/players?season=${matchData.MaMuaGiai}`
        );
        if (!awayResponse.ok)
          console.error("Failed to fetch away team players");
        const awayData = await awayResponse.json();
        setAwayTeamPlayers(awayData.players);
      } catch (e) {
        console.error("Fetch Error:", e);
        setError(e);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [API_URL, MaTranDau]);

  const addGoal = () => {
    if (!editedMatch) {
      console.error("editedMatch is null");
      return;
    }
    setEditedMatch({
      ...editedMatch,
      goals: [
        ...(editedMatch.goals || []),
        { player: "", teamId: null, type: "", time: "" },
      ],
    });
  };

  const removeGoal = async (goalId) => {
    try {
      const response = await fetch(
        `${API_URL}/matches/${match.matchId}/goals/${goalId}`,
        {
          method: "DELETE",
        }
      );
      if (!response.ok) {
        throw new Error(`Could not delete goal: ${response.statusText}`);
      }
      setMatch((prevMatch) => ({
        ...prevMatch,
        goals: prevMatch.goals.filter((goal) => goal.goalId !== goalId),
      }));
      setEditedMatch((prevEditedMatch) => ({
        ...prevEditedMatch,
        goals: prevEditedMatch.goals.filter((goal) => goal.goalId !== goalId),
      }));
    } catch (error) {
      console.error("Error deleting goal:", error);
    }
  };
  const handleGoalChange = (index, field, value) => {
    const updatedGoals = editedMatch.goals.map((goal, i) => {
      if (i === index) {
        let updatedValue = value;
        if (field === "player") {
          const parsedValue = parseInt(value);
          updatedValue = isNaN(parsedValue) ? null : parsedValue;
        }
        const updatedGoal = {
          ...goal,
          [field]: updatedValue,
        };
        return updatedGoal;
      }
      return goal;
    });
    setEditedMatch({ ...editedMatch, goals: updatedGoals });
  };

  const handleCardChange = (index, field, value) => {
    const updatedCards = editedMatch.cards.map((card, i) => {
      if (i === index) {
        const updatedCard = {
          ...card,
          [field]: field === "playerId" ? parseInt(value) || null : value,
        };
        return updatedCard;
      }
      return card;
    });
    setEditedMatch({ ...editedMatch, cards: updatedCards });
  };

  const addCard = () => {
    if (!editedMatch) {
      console.error("editedMatch is null");
      return;
    }
    setEditedMatch({
      ...editedMatch,
      cards: [
        ...(editedMatch.cards || []),
        { playerId: "", teamId: null, type: "Yellow", time: "" },
      ],
    });
  };

  const removeCard = async (cardId) => {
    try {
      const response = await fetch(
        `${API_URL}/matches/${match.matchId}/cards/${cardId}`,
        {
          method: "DELETE",
        }
      );
      if (!response.ok) {
        throw new Error(`Could not delete card: ${response.statusText}`);
      }
      setMatch((prevMatch) => ({
        ...prevMatch,
        cards: prevMatch.cards.filter((card) => card.cardId !== cardId),
      }));
      setEditedMatch((prevEditedMatch) => ({
        ...prevEditedMatch,
        cards: prevEditedMatch.cards.filter((card) => card.cardId !== cardId),
      }));
    } catch (error) {
      console.error("Error deleting card:", error);
    }
  };

  const handleSaveGoals = async () => {
    try {
      const newGoals = sortedGoals.filter((goal) => !goal.goalId);
      const existingGoals = sortedGoals.filter((goal) => goal.goalId);

      for (const newGoal of newGoals) {
        const response = await fetch(
          `${API_URL}/matches/${match.matchId}/goals`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(newGoal),
          }
        );
        if (!response.ok)
          throw new Error(`Could not add goal: ${response.statusText}`);
      }

      for (const existingGoal of existingGoals) {
        const response = await fetch(
          `${API_URL}/matches/${match.matchId}/goals/${existingGoal.goalId}`,
          {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(existingGoal),
          }
        );
        if (!response.ok)
          throw new Error(`Could not update goal: ${response.statusText}`);
      }

      const response = await fetch(`${API_URL}/matches/${match.matchId}`);
      if (!response.ok)
        throw new Error(
          `Could not fetch updated match data: ${response.statusText}`
        );
      const data = await response.json();
      setMatch(data);
      setEditedMatch(data);
      setIsEditingGoals(false);
    } catch (error) {
      console.error("Error updating goals:", error);
    }
  };

  const handleSaveCards = async () => {
    try {
      const newCards = sortedCards.filter((card) => !card.cardId);
      const existingCards = sortedCards.filter((card) => card.cardId);

      for (const newCard of newCards) {
        const response = await fetch(
          `${API_URL}/matches/${match.matchId}/cards`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(newCard),
          }
        );
        if (!response.ok)
          throw new Error(`Could not add card: ${response.statusText}`);
      }

      for (const existingCard of existingCards) {
        const response = await fetch(
          `${API_URL}/matches/${match.matchId}/cards/${existingCard.cardId}`,
          {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(existingCard),
          }
        );
        if (!response.ok)
          throw new Error(`Could not update card: ${response.statusText}`);
      }

      const response = await fetch(`${API_URL}/matches/${match.matchId}`);
      if (!response.ok)
        throw new Error(
          `Could not fetch updated match data: ${response.statusText}`
        );
      const data = await response.json();
      setMatch(data);
      setEditedMatch(data);
      setIsEditingCards(false);
    } catch (error) {
      console.error("Error updating cards:", error);
    }
  };

  const handleCancelGoals = () => {
    setIsEditingGoals(false);
    setEditedMatch(match);
  };

  const handleCancelCards = () => {
    setIsEditingCards(false);
    setEditedMatch(match);
  };

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

  const getSortIndicator = (key, sortConfig) => {
    if (sortConfig.key === key) {
      return sortConfig.direction === "ascending" ? "↑" : "↓";
    }
    return "";
  };

  const getPlayerName = (playerId) => {

    if (!homeTeamPlayers.length || !awayTeamPlayers.length) {
      console.warn("Player arrays are empty in getPlayerName");
      return "Unknown Player";
    }
    const player = [...homeTeamPlayers, ...awayTeamPlayers].find(
      (p) => p && p.id === playerId
    );
    if (!player) {
      console.warn(`Player with id ${playerId} not found`);
    }
    return player ? player.name : "Unknown Player";
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

  const sortedGoals = useMemo(() => {
    const sortableGoals = editedMatch?.goals ? [...editedMatch.goals] : [];
    if (goalSortConfig.key !== null) {
      sortableGoals.sort((a, b) => {
        const aValue =
          goalSortConfig.key === "player" ? getPlayerName(a.player) : a[goalSortConfig.key];
        const bValue =
          goalSortConfig.key === "player" ? getPlayerName(b.player) : b[goalSortConfig.key];
        if (aValue < bValue)
          return goalSortConfig.direction === "ascending" ? -1 : 1;
        if (aValue > bValue)
          return goalSortConfig.direction === "ascending" ? 1 : -1;
        return 0;
      });
    }
    return sortableGoals;
  }, [editedMatch?.goals, goalSortConfig, homeTeamPlayers, awayTeamPlayers]);

  const sortedCards = useMemo(() => {
    const sortableCards = editedMatch?.cards ? [...editedMatch.cards] : [];
    if (cardSortConfig.key !== null) {
      sortableCards.sort((a, b) => {
        const aValue =
          cardSortConfig.key === "playerId"
            ? getPlayerName(a.playerId)
            : a[cardSortConfig.key];
        const bValue =
          cardSortConfig.key === "playerId"
            ? getPlayerName(b.playerId)
            : b[cardSortConfig.key];
        if (aValue < bValue)
          return cardSortConfig.direction === "ascending" ? -1 : 1;
        if (aValue > bValue)
          return cardSortConfig.direction === "ascending" ? 1 : -1;
        return 0;
      });
    }
    return sortableCards;
  }, [editedMatch?.cards, cardSortConfig, homeTeamPlayers, awayTeamPlayers]);

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

  return (
    <div className={styles.matchDetails}>
      <h1 className={styles.matchTitle}>
        {match?.homeTeamName} <span>vs</span> {match?.awayTeamName}
      </h1>

      {match?.isFinished && (
        <div>
          <button className={styles.smallDetailsButton} onClick={toggleResult}>
            {showResult ? "Ẩn kết quả trận đấu" : "Hiện kết quả trận đấu"}
          </button>
        </div>
      )}

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
                  <div className={styles.editSection}>
                    {showGoals && !isEditingGoals && match && (
                      <button
                        className={styles.editButton}
                        onClick={handleEditGoals}
                      >
                        Chỉnh sửa bàn thắng
                      </button>
                    )}
                  </div>
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
                            <tr key={`goal-${goal.goalId || index}`}>
                              <td>
                                {isEditingGoals ? (
                                  <select
                                    value={goal.player || ""}
                                    onChange={(e) =>
                                      handleGoalChange(
                                        index,
                                        "player",
                                        parseInt(e.target.value) || null
                                      )
                                    }
                                  >
                                    <option value="">Chọn cầu thủ</option>
                                    {getAvailablePlayersForTeam(goal.teamId).map(
                                      (player) => (
                                        <option key={player.id} value={player.id}>
                                          {player.name}
                                        </option>
                                      )
                                    )}
                                  </select>
                                ) : goal.player ? (
                                  getPlayerName(goal.player)
                                ) : (
                                  "Chưa chọn cầu thủ"
                                )}
                              </td>
                              <td>
                                {isEditingGoals ? (
                                  <select
                                    value={goal.teamId || ""}
                                    onChange={(e) =>
                                      handleGoalChange(
                                        index,
                                        "teamId",
                                        parseInt(e.target.value) || null
                                      )
                                    }
                                  >
                                    <option value={match.homeTeamId}>
                                      {match.homeTeamName}
                                    </option>
                                    <option value={match.awayTeamId}>
                                      {match.awayTeamName}
                                    </option>
                                  </select>
                                ) : goal.teamId === match.homeTeamId ? (
                                  match.homeTeamName
                                ) : (
                                  match.awayTeamName
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
                                    onClick={() => removeGoal(goal.goalId)}
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
                      {isEditingGoals && match && (
                        <button
                          type="button"
                          onClick={addGoal}
                          className={styles.addButton}
                        >
                          Thêm bàn thắng
                        </button>
                      )}
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

                  <div className={styles.editSection}>
                    {showCards && !isEditingCards && match && (
                      <button
                        className={styles.editButton}
                        onClick={handleEditCards}
                      >
                        Chỉnh sửa thẻ phạt
                      </button>
                    )}
                  </div>

                  {showCards && (
                    <div>
                      <span className={styles.label}>Thẻ phạt:</span>
                      <table className={styles.cardTable}>
                        <thead>
                          <tr>
                            <th onClick={() => sortCards("playerId")}>
                              Cầu thủ{" "}
                              {getSortIndicator("playerId", cardSortConfig)}
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
                            <tr key={`card-${card.cardId || index}`}>
                              <td>
                                {isEditingCards ? (
                                  <select
                                    value={card.playerId || ""}
                                    onChange={(e) =>
                                      handleCardChange(
                                        index,
                                        "playerId",
                                        parseInt(e.target.value) || null
                                      )
                                    }
                                  >
                                    <option value="">Chọn cầu thủ</option>
                                    {getAvailablePlayersForTeam(card.teamId).map(
                                      (player) => (
                                        <option key={player.id} value={player.id}>
                                          {player.name}
                                        </option>
                                      )
                                    )}
                                  </select>
                                ) : card.playerId ? (
                                  getPlayerName(card.playerId)
                                ) : (
                                  "Chưa chọn cầu thủ"
                                )}
                              </td>
                              <td>
                                {isEditingCards ? (
                                  <select
                                    value={card.teamId || ""}
                                    onChange={(e) =>
                                      handleCardChange(
                                        index,
                                        "teamId",
                                        parseInt(e.target.value) || null
                                      )
                                    }
                                  >
                                    <option value={match.homeTeamId}>
                                      {match.homeTeamName}
                                    </option>
                                    <option value={match.awayTeamId}>
                                      {match.awayTeamName}
                                    </option>
                                  </select>
                                ) : card.teamId === match.homeTeamId ? (
                                  match.homeTeamName
                                ) : (
                                  match.awayTeamName
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
                                    onClick={() => removeCard(card.cardId)}
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
                      {isEditingCards && match && (
                        <button
                          type="button"
                          onClick={addCard}
                          className={styles.addButton}
                        >
                          Thêm thẻ phạt
                        </button>
                      )}
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