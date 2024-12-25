import React, { useState, useMemo, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import styles from "./MatchDetails.module.css";

function MatchDetails({API_URL}){
  const { season, id } = useParams();
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
      } catch (e) {
        setError(e);
      } finally {
        setLoading(false);
      }
    };

    fetchMatchDetails();
  }, [id]);

  // Sắp xếp danh sách bàn thắng
  const sortedGoals = useMemo(() => {
    const sortableGoals = match && match.goals
      ? [...(isEditingGoals ? editedMatch?.goals || [] : match.goals)]
      : [];
    if (goalSortConfig.key !== null) {
      sortableGoals.sort((a, b) => {
        if (a[goalSortConfig.key] < b[goalSortConfig.key]) {
          return goalSortConfig.direction === "ascending" ? -1 : 1;
        }
        if (a[goalSortConfig.key] > b[goalSortConfig.key]) {
          return goalSortConfig.direction === "ascending" ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableGoals;
  }, [match, isEditingGoals, editedMatch, goalSortConfig]);

  // Sắp xếp danh sách thẻ phạt
  const sortedCards = useMemo(() => {
    const sortableCards = match && match.cards
      ? [...(isEditingCards ? editedMatch?.cards || [] : match.cards || [])]
      : [];
    if (cardSortConfig.key !== null) {
      sortableCards.sort((a, b) => {
        if (a[cardSortConfig.key] < b[cardSortConfig.key]) {
          return cardSortConfig.direction === "ascending" ? -1 : 1;
        }
        if (a[cardSortConfig.key] > b[cardSortConfig.key]) {
          return cardSortConfig.direction === "ascending" ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableCards;
  }, [match, isEditingCards, editedMatch, cardSortConfig]);

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
    setEditedMatch({ ...match });
  };

  const handleEditCards = () => {
    setIsEditingCards(true);
    setEditedMatch({ ...match });
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
      goals: [...editedMatch.goals, { player: "", team: "", type: "", time: "" }],
    });
  };

  const removeGoal = (index) => {
    setEditedMatch({
      ...editedMatch,
      goals: editedMatch.goals.filter((_, i) => i !== index),
    });
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
        ...editedMatch.cards,
        { player: "", team: "", type: "Yellow", time: "" },
      ],
    });
  };

  const removeCard = (index) => {
    setEditedMatch({
      ...editedMatch,
      cards: editedMatch.cards.filter((_, i) => i !== index),
    });
  };

  const handleSaveGoals = async () => {
    try {
      const response = await fetch(`${API_URL}/matches/${match.matchId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ goals: editedMatch.goals }),
      });
      if (!response.ok) {
        throw new Error(`Could not update goals: ${response.statusText}`);
      }
      setMatch(prevMatch => ({ ...prevMatch, goals: editedMatch.goals }));
      setIsEditingGoals(false);
      setEditedMatch(null);
    } catch (error) {
      console.error("Error updating goals:", error);
      // Optionally set an error state to display a message to the user
    }
  };

  const handleSaveCards = async () => {
    try {
      const response = await fetch(`${API_URL}/matches/${match.matchId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ cards: editedMatch.cards }),
      });
      if (!response.ok) {
        throw new Error(`Could not update cards: ${response.statusText}`);
      }
      setMatch(prevMatch => ({ ...prevMatch, cards: editedMatch.cards }));
      setIsEditingCards(false);
      setEditedMatch(null);
    } catch (error) {
      console.error("Error updating cards:", error);
      // Optionally set an error state to display a message to the user
    }
  };

  const handleCancelGoals = () => {
    setIsEditingGoals(false);
    setEditedMatch(null);
  };

  const handleCancelCards = () => {
    setIsEditingCards(false);
    setEditedMatch(null);
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

  return (
    <div className={styles.matchDetails}>
      <h1 className={styles.matchTitle}>
        {match.homeTeamName} <span>vs</span> {match.awayTeamName}
      </h1>
      <div className={styles.matchInfo}>
        <div className={styles.infoItem}>
          <span className={styles.label}>Mùa giải:</span> {match.season}
        </div>
        <div className={styles.infoItem}>
          <span className={styles.label}>Vòng đấu:</span> {match.roundName}
        </div>
        <div className={styles.infoItem}>
          <span className={styles.label}>Ngày:</span> {match.date}
        </div>
        <div className={styles.infoItem}>
          <span className={styles.label}>Giờ:</span> {match.time}
        </div>
        <div className={styles.infoItem}>
          <span className={styles.label}>Sân vận động:</span> {match.stadiumName}
        </div>
      </div>

      {/* Buttons để hiện/ẩn thông tin chi tiết */}
      {match.isFinished && (
        <div>
          <button className={styles.smallDetailsButton} onClick={toggleResult}>
            {showResult ? "Ẩn kết quả trận đấu" : "Hiện kết quả trận đấu"}
          </button>
        </div>
      )}

      {/* Thông tin chi tiết trận đấu */}
      {match.isFinished && showResult && (
        <div className={styles.matchDetailsContainer}>
          <table className={styles.matchDetailsTable}>
            <tbody>
              <tr>
                <td>
                  <span className={styles.label}>Đội 1:</span> {match.homeTeamName}
                </td>
                <td>
                  <span className={styles.label}>Đội 2:</span> {match.awayTeamName}
                </td>
              </tr>
              <tr>
                <td>
                  <span className={styles.label}>Tỷ số:</span>{" "}
                  {match.homeScore} - {match.awayScore}
                </td>
                <td>
                  <span className={styles.label}>Sân đấu:</span> {match.stadiumName}
                </td>
              </tr>
              <tr>
                <td>
                  <span className={styles.label}>Ngày:</span> {match.date}
                </td>
                <td>
                  <span className={styles.label}>Thời gian:</span> {match.time}
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
                            <th onClick={() => sortGoals("team")}>
                              Đội {getSortIndicator("team", goalSortConfig)}
                            </th>
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
                                  <input
                                    type="text"
                                    value={goal.player}
                                    onChange={(e) =>
                                      handleGoalChange(
                                        index,
                                        "player",
                                        e.target.value
                                      )
                                    }
                                  />
                                ) : (
                                  goal.player
                                )}
                              </td>
                              <td>
                                {isEditingGoals ? (
                                  <input
                                    type="text"
                                    value={goal.team}
                                    onChange={(e) =>
                                      handleGoalChange(
                                        index,
                                        "team",
                                        e.target.value
                                      )
                                    }
                                  />
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
                            <th onClick={() => sortCards("team")}>
                              Đội {getSortIndicator("team", cardSortConfig)}
                            </th>
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
                                  <input
                                    type="text"
                                    value={card.player}
                                    onChange={(e) =>
                                      handleCardChange(
                                        index,
                                        "player",
                                        e.target.value
                                      )
                                    }
                                  />
                                ) : (
                                  card.player
                                )}
                              </td>
                              <td>
                                {isEditingCards ? (
                                  <input
                                    type="text"
                                    value={card.team}
                                    onChange={(e) =>
                                      handleCardChange(
                                        index,
                                        "team",
                                        e.target.value
                                      )
                                    }
                                  />
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