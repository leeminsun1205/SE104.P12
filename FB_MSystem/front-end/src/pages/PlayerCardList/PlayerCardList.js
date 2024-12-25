import React, { useState, useMemo, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import SeasonSelector from "../../components/SeasonSelector/SeasonSelector";
import styles from "./PlayerCardList.module.css";

function PlayerCardList({ API_URL }) {
  const [cardList, setCardList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [availableSeasons, setAvailableSeasons] = useState([]);
  const [selectedSeason, setSelectedSeason] = useState("");
  const [notFound, setNotFound] = useState(false);
  const [sortConfig, setSortConfig] = useState({
    key: null,
    direction: "ascending",
  });
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
    if (!selectedSeason) {
        setCardList([]);
        setSortConfig({ key: null, direction: 'ascending' });
        setNotFound(false);
        return;
    }

    const fetchCardList = async () => {
        setLoading(true);
        setError(null);
        setNotFound(false);
        try {
            const response = await fetch(`${API_URL}/seasons/cards?season=${selectedSeason}`);
            if (!response.ok) {
                if (response.status === 404) {
                    console.log(`Card list not found for season: ${selectedSeason}`);
                    setNotFound(true);
                    setCardList([]);
                } else {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return;
            }
            const data = await response.json();
            console.log("Dữ liệu thẻ phạt từ API:", data); // Debug API response
            setCardList(data.map((player)=>{
                const playerBanned = player.playerState? 'được thi đấu' : 'cấm thi đấu'
                return {
                    ...player,
                    playerBanned: playerBanned,
                }
            }))
        } catch (error) {
            console.error("Lỗi khi fetch danh sách thẻ:", error);
            setError("Failed to load card List.");
            setCardList([]);
        } finally {
            setLoading(false);
        }
    };

    fetchCardList();
  }, [selectedSeason]);

  const handleSeasonChange = (season) => {
    console.log("Mùa giải được chọn:", season); // Debug season selection
    setSelectedSeason(season);
  };

  const requestSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
        direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  const sortedCardList = useMemo(() => {
    const sortedCard = [...cardList];
    if (sortConfig.key !== null) {
        sortedCard.sort((a, b) => {
            if (a[sortConfig.key] < b[sortConfig.key]) {
                return sortConfig.direction === 'ascending' ? -1 : 1;
            }
            if (a[sortConfig.key] > b[sortConfig.key]) {
                return sortConfig.direction === 'ascending' ? 1 : -1;
            }
            return 0;
        });
    }
    return sortedCard;
  }, [cardList, sortConfig]);
  

  const getSortIndicator = (key) => {
    if (sortConfig.key === key) {
        return sortConfig.direction === 'ascending' ? "↑" : "↓";
    }
    return "";
  };

  if (loading) {
    return <div>Đang tải dữ liệu danh sách thẻ phạt...</div>;
  }

  if (error) {
    return <div>Lỗi: {error}</div>;
  }

  const handleRowClick = (id, teamId) => {
    console.log(`handleRowClick - Player ID: ${id}, Team ID: ${teamId}`); // Debug handleRowClick
    navigate(`/teams/${teamId}/players/${id}`);
  };

  return (
    <div className={styles.cardListContainer}>
        <h2 className={styles.cardListTitle}>Danh sách thẻ phạt cầu thủ</h2>
        {setAvailableSeasons.length > 0 && (
            <SeasonSelector
                onSeasonChange={handleSeasonChange}
                seasons={availableSeasons.map(season => ({ id: season.id, name: season.name }))}
                selectedSeason={selectedSeason}
            />
        )}

        <div className={styles.tableWrapper}>
            <table className={styles.cardListTable}>
                <thead>
                    <tr>
                        <th onClick={() => requestSort('name')}>Cầu thủ {getSortIndicator('name')}</th>
                        <th onClick={() => requestSort('team')}>Đội {getSortIndicator('team')}</th>
                        <th onClick={() => requestSort('playerType')}>Loại cầu thủ {getSortIndicator('playerType')}</th>
                        <th onClick={() => requestSort('soThe')}>Số thẻ {getSortIndicator('soThe')}</th>
                        <th onClick={() => requestSort('playerBanned')}>Tình trạng thi đấu {getSortIndicator('playerBanned')}</th>
                    </tr>
                </thead>
                <tbody>
                    {selectedSeason ? (
                        sortedCardList.length > 0 ? (
                            sortedCardList.map((player) => {
                                console.log("Cầu thủ trong map:", player); // Debug players object in map
                                return (
                                    <tr
                                        key={`${player.soThe}-${player.playerState}-${player.name}-${player.team}-${player.playerType}`}
                                        onClick={() => handleRowClick(player.id, player.teamId)}
                                        className={styles.cardListRow}
                                    >
                                        <td>{player.name}</td>
                                        <td className={styles.teamName}>{player.team}</td>
                                        <td>{player.playerType}</td>
                                        <td>{player.soThe}</td>
                                        <td>{player.playerBanned}</td>
                                    </tr>
                                );
                            })
                        ) : loading ? (
                            <tr><td colSpan="7" style={{ textAlign: 'center' }}>Đang tải dữ liệu bảng xếp hạng...</td></tr>
                        ) : notFound ? ( // Changed colspan to 9
                            <tr><td colSpan="9" style={{ textAlign: 'center' }}>Không tìm thấy bảng xếp hạng cho mùa giải này.</td></tr>
                        ) : error ? (
                            <tr><td colSpan="9" style={{ textAlign: 'center' }}>Lỗi: {error}</td></tr>
                        ) : (
                            <tr><td colSpan="9" style={{ textAlign: 'center' }}>Không có dữ liệu cho mùa giải này.</td></tr>
                        )
                    ) : (
                        <tr><td colSpan="7" style={{ textAlign: 'center' }}>Vui lòng chọn một mùa giải</td></tr>
                    )}
                </tbody>
            </table>
        </div>
    </div>
  );
}

export default PlayerCardList;