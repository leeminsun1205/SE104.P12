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
  const [loaiBanThangOptions, setLoaiBanThangOptions] = useState([]);
  const [loaiBanThangLoading, setLoaiBanThangLoading] = useState(true);
  const [loaiBanThangError, setLoaiBanThangError] = useState(null);
  const [matchGoals, setMatchGoals] = useState([]);
  const [matchGoalsLoading, setMatchGoalsLoading] = useState(true);
  const [matchGoalsError, setMatchGoalsError] = useState(null);
  const [matchCards, setMatchCards] = useState([]);
  const [matchCardsLoading, setMatchCardsLoading] = useState(true);
  const [matchCardsError, setMatchCardsError] = useState(null);
  const [loaiThePhatOptions, setLoaiThePhatOptions] = useState([]);
  const [loaiThePhatLoading, setLoaiThePhatLoading] = useState(true);
  const [loaiThePhatError, setLoaiThePhatError] = useState(null);
  const [showAllGoals, setShowAllGoals] = useState(false);
  const [showAllCards, setShowAllCards] = useState(false);

  useEffect(() => {
    const fetchLoaiBanThang = async () => {
      setLoaiBanThangLoading(true);
      setLoaiBanThangError(null);
      try {
        const response = await fetch(`${API_URL}/loai-ban-thang`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setLoaiBanThangOptions(data);
      } catch (e) {
        console.error("Error fetching loại bàn thắng:", e);
        setLoaiBanThangError(e);
      } finally {
        setLoaiBanThangLoading(false);
      }
    };

    fetchLoaiBanThang();
  }, [API_URL]);

  useEffect(() => {
    const fetchLoaiThePhat = async () => {
      setLoaiThePhatLoading(true);
      setLoaiThePhatError(null);
      try {
        const response = await fetch(`${API_URL}/loai-the-phat`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setLoaiThePhatOptions(data);
      } catch (e) {
        console.error("Error fetching loại thẻ phạt:", e);
        setLoaiThePhatError(e);
      } finally {
        setLoaiThePhatLoading(false);
      }
    };

    fetchLoaiThePhat();
  }, [API_URL]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const matchResponse = await fetch(`${API_URL}/tran-dau/${MaTranDau}`);
        if (!matchResponse.ok)
          throw new Error(`HTTP error! status: ${matchResponse.status}`);
        const matchData = await matchResponse.json();
        setMatch(matchData.tranDau);
        setEditedMatch(matchData.tranDau);
        const homeResponse = await fetch(
          `${API_URL}/mg-db/mua-giai/${MaMuaGiai}/doi-bong/${matchData.tranDau.DoiBongNha.MaDoiBong}`
        );
        if (!homeResponse.ok)
          console.error("Failed to fetch home team players");
        const homeData = await homeResponse.json();
        setHomeTeamPlayers(homeData.cauThu);

        const awayResponse = await fetch(
          `${API_URL}/mg-db/mua-giai/${MaMuaGiai}/doi-bong/${matchData.tranDau.DoiBongKhach.MaDoiBong}`
        );
        if (!awayResponse.ok)
          console.error("Failed to fetch away team players");
        const awayData = await awayResponse.json();
        setAwayTeamPlayers(awayData.cauThu);
      } catch (e) {
        console.error("Fetch Error:", e);
        setError(e);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [API_URL, MaTranDau, MaMuaGiai]);

  useEffect(() => {
    const fetchMatchGoals = async () => {
      setMatchGoalsLoading(true);
      setMatchGoalsError(null);
      try {
        const response = await fetch(`${API_URL}/ban-thang/tran-dau/${MaTranDau}`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setMatchGoals(data);
      } catch (error) {
        console.error("Error fetching match goals:", error);
        setMatchGoalsError(error);
      } finally {
        setMatchGoalsLoading(false);
      }
    };

    fetchMatchGoals();
  }, [API_URL, MaTranDau]);

  useEffect(() => {
    const fetchMatchCards = async () => {
      setMatchCardsLoading(true);
      setMatchCardsError(null);
      try {
        const response = await fetch(`${API_URL}/the-phat/tran-dau/${MaTranDau}`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setMatchCards(data);
      } catch (error) {
        console.error("Error fetching match cards:", error);
        setMatchCardsError(error);
      } finally {
        setMatchCardsLoading(false);
      }
    };

    fetchMatchCards();
  }, [API_URL, MaTranDau]);

  const handleStartMatch = async () => {
    try {
      const response = await fetch(`${API_URL}/tran-dau/${MaTranDau}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ TinhTrang: true, BanThangDoiNha: 0, BanThangDoiKhach: 0 }), // Khởi tạo tỷ số
      });
      if (!response.ok) {
        const message = await response.text();
        throw new Error(`Không thể bắt đầu trận đấu: ${message}`);
      }
      const updatedMatchData = await response.json();
      setMatch(updatedMatchData.tranDau);
    } catch (error) {
      console.error("Lỗi khi bắt đầu trận đấu:", error);
      setError(error);
    }
  };

  const handleEndMatch = async () => {
    try {
      // Lấy danh sách bàn thắng cuối cùng để tính tỷ số
      const goalsResponse = await fetch(`${API_URL}/ban-thang/tran-dau/${MaTranDau}`);
      let homeGoals = 0;
      let awayGoals = 0;
      if (goalsResponse.ok) {
        const goalsData = await goalsResponse.json();
        homeGoals = goalsData.filter(goal => goal.MaDoiBong === match.DoiBongNha.MaDoiBong).length;
        awayGoals = goalsData.filter(goal => goal.MaDoiBong === match.DoiBongKhach.MaDoiBong).length;
      }

      const response = await fetch(`${API_URL}/tran-dau/${MaTranDau}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ TinhTrang: false, BanThangDoiNha: homeGoals, BanThangDoiKhach: awayGoals }), // Cập nhật tỷ số khi kết thúc
      });
      if (!response.ok) {
        const message = await response.text();
        throw new Error(`Không thể kết thúc trận đấu: ${message}`);
      }
      const updatedMatchData = await response.json();
      setMatch(updatedMatchData.tranDau);
    } catch (error) {
      console.error("Lỗi khi kết thúc trận đấu:", error);
      setError(error);
    }
  };

  const addGoal = () => {
    if (!editedMatch) {
      console.error("editedMatch is null");
      return;
    }
    setEditedMatch({
      ...editedMatch,
      banThang: [
        ...(editedMatch.banThang || []),
        { MaCauThu: null, MaDoiBong: null, MaLoaiBanThang: "", ThoiGian: "" },
      ],
    });
  };

  const removeGoal = async (goalId) => {
    try {
      const response = await fetch(`${API_URL}/ban-thang/${goalId}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        throw new Error(`Could not delete goal: ${response.statusText}`);
      }
      setMatch((prevMatch) => ({
        ...prevMatch,
        banThang: prevMatch.banThang.filter((goal) => goal.MaBanThang !== goalId),
      }));
      setEditedMatch((prevEditedMatch) => ({
        ...prevEditedMatch,
        banThang: prevEditedMatch.banThang.filter(
          (goal) => goal.MaBanThang !== goalId
        ),
      }));
      const fetchUpdatedGoals = async () => {
        const response = await fetch(`${API_URL}/ban-thang/tran-dau/${MaTranDau}`);
        if (response.ok) {
          const data = await response.json();
          setMatchGoals(data);
        }
      };
      fetchUpdatedGoals();
    } catch (error) {
      console.error("Error deleting goal:", error);
    }
  };

  const handleGoalChange = (index, field, value) => {
    const updatedGoals = editedMatch.banThang.map((goal, i) => {
      if (i === index) {
        let updatedValue = value;
        if (field === "MaCauThu") {
          updatedValue = value;
        } else if (field === "MaDoiBong") {
          updatedValue = value;
        } else if (field === "MaLoaiBanThang") {
          updatedValue = value;
        }
        const updatedGoal = {
          ...goal,
          [field]: updatedValue,
        };
        return updatedGoal;
      }
      return goal;
    });
    setEditedMatch({ ...editedMatch, banThang: updatedGoals });
  };

  const handleCardChange = (index, field, value) => {
    const updatedCards = editedMatch.thePhat.map((card, i) => {
      if (i === index) {
        const updatedCard = {
          ...card,
          [field]: field === "MaCauThu" ? value || null : value,
        };
        return updatedCard;
      }
      return card;
    });
    setEditedMatch({ ...editedMatch, thePhat: updatedCards });
  };

  const addCard = () => {
    if (!editedMatch) {
      console.error("editedMatch is null");
      return;
    }
    setEditedMatch({
      ...editedMatch,
      thePhat: [
        ...(editedMatch.thePhat || []),
        { MaCauThu: null, MaTranDau: MaTranDau, MaLoaiThePhat: "", ThoiGian: "", LyDo: "" },
      ],
    });
  };

  const removeCard = async (MaThePhat) => {
    try {
      const response = await fetch(
        `${API_URL}/the-phat/${MaTranDau}/${MaThePhat}`,
        {
          method: "DELETE",
        }
      );
      if (!response.ok) {
        throw new Error(`Could not delete card: ${response.statusText}`);
      }
      setMatch((prevMatch) => ({
        ...prevMatch,
        thePhat: prevMatch.thePhat.filter((card) => card.MaThePhat !== MaThePhat),
      }));
      setEditedMatch((prevEditedMatch) => ({
        ...prevEditedMatch,
        thePhat: prevEditedMatch.thePhat.filter(
          (card) => card.MaThePhat !== MaThePhat
        ),
      }));
      // Refetch match cards after deleting a card
      const fetchUpdatedCards = async () => {
        const response = await fetch(`${API_URL}/the-phat/tran-dau/${MaTranDau}`);
        if (response.ok) {
          const data = await response.json();
          setMatchCards(data);
        }
      };
      fetchUpdatedCards();
    } catch (error) {
      console.error("Error deleting card:", error);
    }
  };

  const handleSaveGoals = async () => {
    try {
      const newGoals = sortedGoals.filter((goal) => !goal.MaBanThang);
      const existingGoals = sortedGoals.filter((goal) => goal.MaBanThang);

      for (const newGoal of newGoals) {
        const response = await fetch(
          `${API_URL}/ban-thang/tran-dau/${MaTranDau}/doi-bong/${newGoal.MaDoiBong}/cau-thu/${newGoal.MaCauThu}`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(newGoal),
          }
        );
        if (!response.ok)
          throw new Error(`Could not add goal: ${response.statusText}`);
      }
      navigate(`/tran-dau/${MaMuaGiai}/${MaVongDau}/${MaTranDau}`);
      for (const existingGoal of existingGoals) {
        const response = await fetch(
          `${API_URL}/ban-thang/${MaTranDau}/${existingGoal.MaBanThang}`,
          {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(existingGoal),
          }
        );
        if (!response.ok)
          throw new Error(`Could not update goal: ${response.statusText}`);
      }
      navigate(`/tran-dau/${MaMuaGiai}/${MaVongDau}/${MaTranDau}`);
      // Sau khi thêm/cập nhật bàn thắng, tính lại tỷ số
      let homeGoals = 0;
      let awayGoals = 0;

      matchGoals.forEach(goal => {
        if (goal.MaLoaiBanThang === 'LBT03') { // LBT03 là mã loại bàn thắng "Phản lưới nhà"
          if (goal.MaDoiBong === match.DoiBongNha.MaDoiBong) {
            awayGoals++;
          } else {
            homeGoals++;
          }
        } else {
          if (goal.MaDoiBong === match.DoiBongNha.MaDoiBong) {
            homeGoals++;
          } else {
            awayGoals++;
          }
        }
      });

      // Gọi API để cập nhật thông tin trận đấu
      const updateTranDauResponse = await fetch(`${API_URL}/tran-dau/${MaTranDau}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          BanThangDoiNha: homeGoals,
          BanThangDoiKhach: awayGoals,
        }),
      });

      if (!updateTranDauResponse.ok) {
        const message = await updateTranDauResponse.text();
        throw new Error(`Could not update match score: ${message}`);
      }

      const updatedMatchData = await updateTranDauResponse.json();
      setMatch(updatedMatchData.tranDau);
      setEditedMatch(updatedMatchData.tranDau);
      setIsEditingGoals(false);
      const fetchUpdatedGoalsForScore = async () => {
        const response = await fetch(`${API_URL}/ban-thang/tran-dau/${MaTranDau}`);
        if (response.ok) {
          const data = await response.json();
          const homeGoalsCount = data.filter(goal => goal.MaDoiBong === match.DoiBongNha.MaDoiBong).length;
          const awayGoalsCount = data.filter(goal => goal.MaDoiBong === match.DoiBongKhach.MaDoiBong).length;

          // Gọi API để cập nhật thông tin trận đấu VỚI TỶ SỐ MỚI
          const updateTranDauResponse = await fetch(`${API_URL}/tran-dau/${MaTranDau}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              BanThangDoiNha: homeGoalsCount,
              BanThangDoiKhach: awayGoalsCount,
            }),
          });

          if (!updateTranDauResponse.ok) {
            const message = await updateTranDauResponse.text();
            throw new Error(`Could not update match score: ${message}`);
          }

          const updatedMatchData = await updateTranDauResponse.json();
          setMatch(updatedMatchData.tranDau);
          setEditedMatch(updatedMatchData.tranDau);
        }
      };
      await fetchUpdatedGoalsForScore();
    } catch (error) {
      console.error("Error updating goals:", error);
    }
  };

  const handleSaveCards = async () => {
    try {
      const newCards = sortedCards.filter((card) => !card.MaThePhat);
      const existingCards = sortedCards.filter((card) => card.MaThePhat);

      for (const newCard of newCards) {
        const response = await fetch(`${API_URL}/the-phat/`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(newCard),
        });
        if (!response.ok)
          throw new Error(`Could not add card: ${response.statusText}`);
      }

      for (const existingCard of existingCards) {
        const response = await fetch(
          `${API_URL}/the-phat/${MaTranDau}/${existingCard.MaThePhat}`,
          {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(existingCard),
          }
        );
        if (!response.ok)
          throw new Error(`Could not update card: ${response.statusText}`);
      }

      const response = await fetch(`${API_URL}/tran-dau/${MaTranDau}`); // Refetching the entire match
      if (!response.ok)
        throw new Error(
          `Could not fetch updated match data: ${response.statusText}`
        );
      const data = await response.json();
      setMatch(data.tranDau); // Updating the match state here
      setEditedMatch(data.tranDau);
      setIsEditingCards(false);
      // Refetch match cards after saving
      const fetchUpdatedCards = async () => {
        const response = await fetch(`${API_URL}/the-phat/tran-dau/${MaTranDau}`);
        if (response.ok) {
          const data = await response.json();
          setMatchCards(data);
        }
      };
      fetchUpdatedCards();
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

  const getPlayerName = (MaCauThu) => {
    if (!homeTeamPlayers.length || !awayTeamPlayers.length) {
      console.warn("Player arrays are empty in getPlayerName");
      return "Unknown Player";
    }
    const player = [...homeTeamPlayers, ...awayTeamPlayers].find(
      (p) => p && p.MaCauThu === MaCauThu
    );
    if (!player) {
      console.warn(`Player with id ${MaCauThu} not found`);
    }
    return player ? player.TenCauThu : "Unknown Player";
  };

  const getAvailablePlayersForTeam = (MaDoiBong) => {
    const MaDoiBongInt = MaDoiBong;
    if (match?.DoiBongNha?.MaDoiBong === MaDoiBongInt) {
      return homeTeamPlayers;
    } else if (match?.DoiBongKhach?.MaDoiBong === MaDoiBongInt) {
      return awayTeamPlayers;
    }
    return [];
  };

  const sortedGoals = useMemo(() => {
    const sortableGoals = editedMatch?.banThang ? [...editedMatch.banThang] : [];
    if (goalSortConfig.key !== null) {
      sortableGoals.sort((a, b) => {
        const aValue =
          goalSortConfig.key === "MaCauThu"
            ? getPlayerName(a.MaCauThu)
            : a[goalSortConfig.key];
        const bValue =
          goalSortConfig.key === "MaCauThu"
            ? getPlayerName(b.MaCauThu)
            : b[goalSortConfig.key];
        if (aValue < bValue)
          return goalSortConfig.direction === "ascending" ? -1 : 1;
        if (aValue > bValue)
          return goalSortConfig.direction === "ascending" ? 1 : -1;
        return 0;
      });
    }
    return sortableGoals;
  }, [editedMatch?.banThang, goalSortConfig, homeTeamPlayers, awayTeamPlayers]);

  const sortedCards = useMemo(() => {
    const sortableCards = editedMatch?.thePhat ? [...editedMatch.thePhat] : [];
    if (cardSortConfig.key !== null) {
      sortableCards.sort((a, b) => {
        const aValue =
          cardSortConfig.key === "MaCauThu"
            ? getPlayerName(a.MaCauThu)
            : a[cardSortConfig.key];
        const bValue =
          cardSortConfig.key === "MaCauThu"
            ? getPlayerName(b.MaCauThu)
            : b[cardSortConfig.key];
        if (aValue < bValue)
          return cardSortConfig.direction === "ascending" ? -1 : 1;
        if (aValue > bValue)
          return cardSortConfig.direction === "ascending" ? 1 : -1;
        return 0;
      });
    }
    return sortableCards;
  }, [editedMatch?.thePhat, cardSortConfig, homeTeamPlayers, awayTeamPlayers]);

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
          onClick={() => navigate("/tran-dau")}
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
          onClick={() => navigate("/tran-dau")}
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

  const toggleAllGoals = () => {
    setShowAllGoals(!showAllGoals);
  };

  const toggleAllCards = () => {
    setShowAllCards(!showAllCards);
  };
  return (
    <div className={styles.matchDetails}>
      <h1 className={styles.matchTitle}>
        {match.DoiBongNha.TenDoiBong} <span>vs</span> {match.DoiBongKhach.TenDoiBong}
      </h1>

      {match?.TinhTrang === false && match.BanThangDoiNha === null && (
        <button className={styles.actionButton} onClick={handleStartMatch}>
          Bắt đầu trận đấu
        </button>
      )}

      {match?.TinhTrang === true && (
        <button className={styles.actionButton} onClick={handleEndMatch}>
          Kết thúc trận đấu
        </button>
      )}

      {match?.TinhTrang && (
        <div>
          <button className={styles.smallDetailsButton} onClick={toggleResult}>
            {showResult ? "Hiện kết quả trận đấu" : "Ẩn kết quả trận đấu"}
          </button>
        </div>
      )}

      {(match?.TinhTrang && showResult) || (match?.BanThangDoiNha !== null || match?.BanThangDoiKhach !== null) && (
        <div className={styles.matchDetailsContainer}>
          <table className={styles.matchDetailsTable}>
            <tbody>
              <tr>
                <td>
                  <span className={styles.label}>Đội 1:</span>{" "}
                  {match?.DoiBongNha.TenDoiBong}
                </td>
                <td>
                  <span className={styles.label}>Đội 2:</span>{" "}
                  {match?.DoiBongKhach.TenDoiBong}
                </td>
              </tr>
              <tr>
                <td>
                  <span className={styles.label}>Tỷ số:</span>{" "}
                  {match.BanThangDoiNha !== null && match?.BanThangDoiKhach !== null
                    ? `${match?.BanThangDoiNha === null ? 0 : match?.BanThangDoiNha
                    }-${match?.BanThangDoiKhach === null ? 0 : match?.BanThangDoiKhach
                    }`
                    : "Chưa thi đấu"}
                </td>
                <td>
                  <span className={styles.label}>Sân đấu:</span>{" "}
                  {match?.SanThiDau.TenSan}
                </td>
              </tr>
              <tr>
                <td>
                  <span className={styles.label}>Ngày:</span>
                  {match?.NgayThiDau}
                </td>
                <td>
                  <span className={styles.label}>Thời gian:</span>{" "}
                  {match?.GioThiDau}
                </td>
              </tr>
              <tr>
                <td colSpan="2">
                  <div className={styles.toggleButtonsContainer}>
                    {match?.TinhTrang && (<button
                      className={styles.smallDetailsButton}
                      onClick={toggleGoals}
                    >
                      {showGoals ? "Ẩn bàn thắng (Chỉnh sửa)" : "Hiện bàn thắng (Chỉnh sửa)"}
                    </button>) }
                    {match?.TinhTrang && (<button
                      className={styles.smallDetailsButton}
                      onClick={toggleCards}
                    >
                      {showCards ? "Ẩn thẻ phạt (Chỉnh sửa)" : "Hiện thẻ phạt (Chỉnh sửa)"}
                    </button>)}
                    <button
                      className={styles.smallDetailsButton}
                      onClick={toggleAllGoals}
                    >
                      {showAllGoals ? "Ẩn tất cả bàn thắng" : "Hiện tất cả bàn thắng"}
                    </button>
                    <button
                      className={styles.smallDetailsButton}
                      onClick={toggleAllCards}
                    >
                      {showAllCards ? "Ẩn tất cả thẻ phạt" : "Hiện tất cả thẻ phạt"}
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
                      <span className={styles.label}>Bàn thắng (Chỉnh sửa):</span>
                      <table className={styles.goalTable}>
                        <thead>
                          <tr>
                            <th onClick={() => sortGoals("MaCauThu")}>
                              Cầu thủ{" "}
                              {getSortIndicator("MaCauThu", goalSortConfig)}
                            </th>
                            <th>Đội</th>
                            <th onClick={() => sortGoals("MaLoaiBanThang")}>
                              Loại bàn thắng{" "}
                              {getSortIndicator("MaLoaiBanThang", goalSortConfig)}
                            </th>
                            <th onClick={() => sortGoals("ThoiDiem")}>
                              Thời điểm ghi bàn{" "}
                              {getSortIndicator("ThoiDiem", goalSortConfig)}
                            </th>
                            {isEditingGoals && <th>Hành động</th>}
                          </tr>
                        </thead>
                        <tbody>
                          {sortedGoals.map((goal, index) => (
                            <tr key={`goal-${goal.MaBanThang || index}`}>
                              <td>
                                {isEditingGoals ? (
                                  <select
                                    value={goal.MaCauThu || ""}
                                    onChange={(e) =>
                                      handleGoalChange(
                                        index,
                                        "MaCauThu",
                                        e.target.value || null
                                      )
                                    }
                                  >
                                    <option value="">Chọn cầu thủ</option>
                                    {getAvailablePlayersForTeam(goal.MaDoiBong).map(
                                      (player) => (
                                        <option key={player.MaCauThu} value={player.MaCauThu}>
                                          {player.TenCauThu}
                                        </option>
                                      )
                                    )}
                                  </select>
                                ) : goal.MaCauThu ? (
                                  getPlayerName(goal.MaCauThu)
                                ) : (
                                  "Chưa chọn cầu thủ"
                                )}
                              </td>
                              <td>
                                {isEditingGoals ? (
                                  <select
                                    value={goal.MaDoiBong || ""}
                                    onChange={(e) =>
                                      handleGoalChange(
                                        index,
                                        "MaDoiBong",
                                        e.target.value
                                      )
                                    }
                                  >
                                    <option value="">Chọn đội</option>
                                    <option value={match.DoiBongNha.MaDoiBong}>
                                      {match.DoiBongNha.TenDoiBong}
                                    </option>
                                    <option value={match.DoiBongKhach.MaDoiBong}>
                                      {match.DoiBongKhach.TenDoiBong}
                                    </option>
                                  </select>
                                ) : goal.MaDoiBong === match.DoiBongNha.MaDoiBong ? (
                                  match.DoiBongNha.TenDoiBong
                                ) : (
                                  match.DoiBongKhach.TenDoiBong
                                )}
                              </td>
                              <td>
                                {isEditingGoals && !loaiBanThangLoading && !loaiBanThangError ? (
                                  <select
                                    value={goal.MaLoaiBanThang}
                                    onChange={(e) =>
                                      handleGoalChange(
                                        index,
                                        "MaLoaiBanThang",
                                        e.target.value
                                      )
                                    }
                                  >
                                    <option value="">Chọn loại bàn thắng</option>
                                    {loaiBanThangOptions.map((option) => (
                                      <option
                                        key={option.MaLoaiBanThang}
                                        value={option.MaLoaiBanThang}
                                      >
                                        {option.TenLoaiBanThang}
                                      </option>
                                    ))}
                                  </select>
                                ) : loaiBanThangLoading ? (
                                  "Đang tải loại bàn thắng..."
                                ) : loaiBanThangError ? (
                                  "Lỗi tải loại bàn thắng"
                                ) : (
                                  goal.MaLoaiBanThang
                                )}
                              </td>
                              <td>
                                {isEditingGoals ? (
                                  <input
                                    type="text"
                                    value={goal.ThoiDiem}
                                    onChange={(e) =>
                                      handleGoalChange(
                                        index,
                                        "ThoiDiem",
                                        e.target.value
                                      )
                                    }
                                  />
                                ) : (
                                  goal.ThoiDiem
                                )}
                              </td>
                              {isEditingGoals && (
                                <td>
                                  <button
                                    type="button"
                                    onClick={() => removeGoal(goal.MaBanThang)}
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

                  {showAllGoals && (
                    <div>
                      <span className={styles.label}>Tất cả bàn thắng trong trận:</span>
                      {matchGoalsLoading ? (
                        <p>Đang tải thông tin bàn thắng...</p>
                      ) : matchGoalsError ? (
                        <p>Lỗi khi tải thông tin bàn thắng: {matchGoalsError.message}</p>
                      ) : (
                        <table className={styles.goalTable}>
                          <thead>
                            <tr>
                              <th>Cầu thủ</th>
                              <th>Đội</th>
                              <th>Loại bàn thắng</th>
                              <th>Thời điểm ghi bàn</th>
                            </tr>
                          </thead>
                          <tbody>
                            {matchGoals.map((goal) => (
                              <tr key={goal.MaBanThang}>
                                <td>{getPlayerName(goal.MaCauThu)}</td>
                                <td>{goal.DoiBong.TenDoiBong}</td>
                                <td>{goal.LoaiBanThang.TenLoaiBanThang}</td>
                                <td>{goal.ThoiDiem}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      )}
                    </div>
                  )}
                  <div className={styles.editSection}>
                    {showCards && !isEditingCards && match && (
                      <button
                        className={styles.editButton}
                        onClick={handleEditCards}
                      >Chỉnh sửa thẻ phạt
                      </button>
                    )}
                  </div>

                  {showCards && (
                    <div>
                      <span className={styles.label}>Thẻ phạt (Chỉnh sửa):</span>
                      <table className={styles.cardTable}>
                        <thead>
                          <tr>
                            <th onClick={() => sortCards("MaCauThu")}>
                              Cầu thủ{" "}
                              {getSortIndicator("MaCauThu", cardSortConfig)}
                            </th>
                            <th>Đội</th>
                            <th onClick={() => sortCards("MaLoaiThePhat")}>
                              Loại thẻ{" "}
                              {getSortIndicator("MaLoaiThePhat", cardSortConfig)}
                            </th>
                            <th onClick={() => sortCards("ThoiGian")}>
                              Thời gian{" "}
                              {getSortIndicator("ThoiGian", cardSortConfig)}
                            </th>
                            {isEditingCards && <th>Lý do</th>}
                            {isEditingCards && <th>Hành động</th>}
                          </tr>
                        </thead>
                        <tbody>
                          {sortedCards.map((card, index) => (
                            <tr key={`card-${card.MaThePhat || index}`}>
                              <td>
                                {isEditingCards ? (
                                  <select
                                    value={card.MaCauThu || ""}
                                    onChange={(e) =>
                                      handleCardChange(
                                        index,
                                        "MaCauThu",
                                        e.target.value || null
                                      )
                                    }
                                  >
                                    <option value="">Chọn cầu thủ</option>
                                    {getAvailablePlayersForTeam(card.MaDoiBong).map(
                                      (player) => (
                                        <option key={player.MaCauThu} value={player.MaCauThu}>
                                          {player.TenCauThu}
                                        </option>
                                      )
                                    )}
                                  </select>
                                ) : card.MaCauThu ? (
                                  getPlayerName(card.MaCauThu)
                                ) : (
                                  "Chưa chọn cầu thủ"
                                )}
                              </td>
                              <td>
                                {isEditingCards ? (
                                  <select
                                    value={card.MaDoiBong || ""}
                                    onChange={(e) =>
                                      handleCardChange(
                                        index,
                                        "MaDoiBong",
                                        e.target.value
                                      )
                                    }
                                  >
                                    <option value="">Chọn đội</option>
                                    <option value={match.DoiBongNha.MaDoiBong}>
                                      {match.DoiBongNha.TenDoiBong}
                                    </option>
                                    <option value={match.DoiBongKhach.MaDoiBong}>
                                      {match.DoiBongKhach.TenDoiBong}
                                    </option>
                                  </select>
                                ) : card.MaDoiBong === match.DoiBongNha.MaDoiBong ? (
                                  match.DoiBongNha.TenDoiBong
                                ) : (
                                  match.DoiBongKhach.TenDoiBong
                                )}
                              </td>
                              <td>
                                {isEditingCards && !loaiThePhatLoading && !loaiThePhatError ? (
                                  <select
                                    value={card.MaLoaiThePhat}
                                    onChange={(e) =>
                                      handleCardChange(
                                        index,
                                        "MaLoaiThePhat",
                                        e.target.value
                                      )
                                    }
                                  >
                                    <option value="">Chọn loại thẻ</option>
                                    {loaiThePhatOptions.map((option) => (
                                      <option
                                        key={option.MaLoaiThePhat}
                                        value={option.MaLoaiThePhat}
                                      >
                                        {option.TenLoaiThePhat}
                                      </option>
                                    ))}
                                  </select>
                                ) : loaiThePhatLoading ? (
                                  "Đang tải loại thẻ..."
                                ) : loaiThePhatError ? (
                                  "Lỗi tải loại thẻ"
                                ) : card.LoaiThePhat === "LTP01" ? (
                                  <span className={styles.yellowCard}>Thẻ vàng</span>
                                ) : card.LoaiThePhat === "LTP02" ? (
                                  <span className={styles.redCard}>Thẻ đỏ</span>
                                ) : (
                                  "Không xác định"
                                )}
                              </td>
                              <td>
                                {isEditingCards ? (
                                  <input
                                    type="text"
                                    value={card.ThoiGian}
                                    onChange={(e) =>
                                      handleCardChange(
                                        index,
                                        "ThoiGian",
                                        e.target.value
                                      )
                                    }
                                  />
                                ) : (
                                  card.ThoiGian
                                )}
                              </td>
                              <td>
                                {isEditingCards ? (
                                  <input
                                    type="text"
                                    value={card.LyDo}
                                    onChange={(e) =>
                                      handleCardChange(
                                        index,
                                        "LyDo",
                                        e.target.value
                                      )
                                    }
                                  />
                                ) : (
                                  card.LyDo
                                )}
                              </td>
                              {isEditingCards && (
                                <td>
                                  <button
                                    type="button"
                                    onClick={() => removeCard(card.MaThePhat)}
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

                  {showAllCards && (
                    <div>
                      <span className={styles.label}>Tất cả thẻ phạt trong trận:</span>
                      {matchCardsLoading ? (
                        <p>Đang tải thông tin thẻ phạt...</p>
                      ) : matchCardsError ? (
                        <p>Lỗi khi tải thông tin thẻ phạt: {matchCardsError.message}</p>
                      ) : (
                        <table className={styles.cardTable}>
                          <thead>
                            <tr>
                              <th>Cầu thủ</th>
                              <th>Đội</th>
                              <th>Loại thẻ</th>
                              <th>Thời gian</th>
                            </tr>
                          </thead>
                          <tbody>
                            {matchCards.map((card) => (
                              <tr key={card.MaThePhat}>
                                <td>{getPlayerName(card.MaCauThu)}</td>
                                <td>
                                  {card.MaDoiBong === match.DoiBongNha.MaDoiBong
                                    ? match.DoiBongNha.TenDoiBong
                                    : match.DoiBongKhach.TenDoiBong}
                                </td>
                                <td>
                                  {card.LoaiThePhat === "LTP02" ? (
                                    <span className={styles.redCard}>Thẻ đỏ</span>
                                  ) : (
                                    <span className={styles.yellowCard}>
                                      Thẻ vàng
                                    </span>
                                  )}
                                </td>
                                <td>{card.ThoiGian}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
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
        onClick={() => navigate("/tran-dau")}
      >
        Quay lại danh sách trận đấu
      </button>
    </div>
  );
}

export default MatchDetails;