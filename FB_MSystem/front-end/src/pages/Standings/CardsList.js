// CardsList.js
import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './CardsList.module.css';
import SeasonSelector from '../../components/SeasonSelector/SeasonSelector';

function CardsList({ API_URL }) {
    const navigate = useNavigate();
    const [selectedSeason, setSelectedSeason] = useState('');
    const [cards, setCards] = useState([]);
    const [availableSeasons, setAvailableSeasons] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [notFound, setNotFound] = useState(false);
    const [sortConfig, setSortConfig] = useState({ key: null, direction: 'descending' });
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;
    const [players, setPlayers] = useState({});

    useEffect(() => {
        const fetchSeasons = async () => {
            try {
                const response = await fetch(`${API_URL}/mua-giai`);
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();
                setAvailableSeasons(data.seasons.filter(season => season !== 'all'));
            } catch (error) {
                console.error("Error fetching seasons:", error);
                setError("Failed to load seasons.");
            }
        };

        fetchSeasons();
    }, [API_URL]);

    useEffect(() => {
        const fetchPlayersData = async () => {
            if (selectedSeason) {
                try {
                    const response = await fetch(`${API_URL}/cau-thu`);
                    if (!response.ok) {
                        throw new Error(`Could not fetch players: ${response.status}`);
                    }
                    const data = await response.json();
                    const playersMap = {};
                    data.forEach(player => playersMap[player.id] = player);
                    setPlayers(playersMap);
                } catch (error) {
                    console.error("Error fetching players:", error);
                    setError("Failed to load players.");
                }
            } else {
                setPlayers({});
            }
        };

        fetchPlayersData();
    }, [API_URL, selectedSeason]);

    useEffect(() => {
        if (!selectedSeason) {
            setCards([]);
            setSortConfig({ key: null, direction: 'descending' });
            setNotFound(false);
            return;
        }

        const fetchCardsData = async () => {
            setLoading(true);
            setError(null);
            setNotFound(false);
            try {
                const response = await fetch(`${API_URL}/matches?season=${selectedSeason}`);
                if (!response.ok) {
                    if (response.status === 404) {
                        console.log(`Matches not found for season: ${selectedSeason}`);
                        setNotFound(true);
                        setCards([]);
                    } else {
                        throw new Error(`HTTP error! status: ${response.status}`);
                    }
                    return;
                }
                const data = await response.json();
                processMatchData(data);
            } catch (error) {
                console.error("Error fetching match data:", error);
                setError("Failed to load match data.");
                setCards([]);
            } finally {
                setLoading(false);
                setCurrentPage(1);
            }
        };

        const processMatchData = (matches) => {
            const playerCards = {};
            matches.forEach(match => {
                if (match.cards) {
                    match.cards.forEach(card => {
                        const playerId = card.playerId;
                        playerCards[playerId] = {
                            numCards: (playerCards[playerId]?.numCards || 0) + 1,
                        };
                    });
                }
            });

            const playerCardDetails = Object.entries(playerCards).map(([playerId, cardData]) => ({
                playerId: parseInt(playerId),
                numCards: cardData.numCards,
            }));

            const cardsWithDetails = playerCardDetails.map(card => ({
                ...card,
                playerName: players[card.playerId]?.name || 'Không rõ',
                playerType: players[card.playerId]?.playerType || 'Không rõ', 
            })).sort((a, b) => b.numCards - a.numCards);

            setCards(cardsWithDetails);
        };

        fetchCardsData();
    }, [selectedSeason, API_URL, players]);

    const handleSeasonChange = (season) => {
        setSelectedSeason(season);
    };

    const requestSort = (key) => {
        let direction = 'ascending';
        if (sortConfig.key === key && sortConfig.direction === 'ascending') {
            direction = 'descending';
        } else if (sortConfig.key === key && sortConfig.direction === 'descending') {
            direction = 'ascending';
        }
        setSortConfig({ key, direction });
    };

    const sortedCards = useMemo(() => {
        const sortableCards = [...cards];
        if (sortConfig.key !== null) {
            sortableCards.sort((a, b) => {
                const aValue = a[sortConfig.key];
                const bValue = b[sortConfig.key];
                if (typeof aValue === 'number' && typeof bValue === 'number') {
                    return sortConfig.direction === 'ascending' ? aValue - bValue : bValue - aValue;
                } else {
                    if (aValue < bValue) {
                        return sortConfig.direction === 'ascending' ? -1 : 1;
                    }
                    if (aValue > bValue) {
                        return sortConfig.direction === 'ascending' ? 1 : -1;
                    }
                    return 0;
                }
            });
        }
        return sortableCards;
    }, [cards, sortConfig]);

    const getSortIndicator = (key) => {
        if (sortConfig.key === key) {
            return sortConfig.direction === 'ascending' ? "↑" : "↓";
        }
        return "";
    };

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = sortedCards.slice(indexOfFirstItem, indexOfLastItem);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    const pageNumbers = [];
    for (let i = 1; i <= Math.ceil(sortedCards.length / itemsPerPage); i++) {
        pageNumbers.push(i);
    }

    if (loading) {
        return <div>Đang tải dữ liệu thẻ phạt...</div>;
    }

    if (error) {
        return <div>Lỗi: {error}</div>;
    }

    return (
        <div className={styles.cardsListContainer}>
            <h2 className={styles.cardsListTitle}>Danh sách thẻ phạt</h2>
            {availableSeasons.length > 0 && (
                <SeasonSelector
                    onSeasonChange={handleSeasonChange}
                    seasons={availableSeasons}
                    selectedSeason={selectedSeason}
                />
            )}

            <div className={styles.tableWrapper}>
                <table className={styles.cardsTable}>
                    <thead>
                        <tr>
                            <th>Hạng</th>
                            <th onClick={() => requestSort('playerName')}>Cầu thủ {getSortIndicator('playerName')}</th>
                            <th onClick={() => requestSort('playerType')}>Loại cầu thủ {getSortIndicator('playerType')}</th>
                            <th onClick={() => requestSort('numCards')}>Số thẻ phạt {getSortIndicator('numCards')}</th>
                            <th onClick={() => requestSort('numgGames')}>Số trận thi đấu {getSortIndicator('numgGames')}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {selectedSeason ? (
                            currentItems.length > 0 ? (
                                currentItems.map((card, index) => (
                                    <tr key={`${index}-${card.playerId}`}>
                                        <td>{(currentPage - 1) * itemsPerPage + index + 1}</td>
                                        <td>{card.playerName}</td>
                                        <td>{card.playerType}</td>
                                        <td>{card.numCards}</td>
                                        <td>{card.numGames}</td>
                                    </tr>
                                ))
                            ) : loading ? (
                                <tr><td colSpan="5" style={{ textAlign: 'center' }}>Đang tải dữ liệu thẻ phạt...</td></tr>
                            ) : notFound ? (
                                <tr><td colSpan="5" style={{ textAlign: 'center' }}>Không tìm thấy dữ liệu thẻ phạt cho mùa giải này.</td></tr>
                            ) : error ? (
                                <tr><td colSpan="5" style={{ textAlign: 'center' }}>Lỗi: {error}</td></tr>
                            ) : (
                                <tr><td colSpan="5" style={{ textAlign: 'center' }}>Không có dữ liệu cho mùa giải này.</td></tr>
                            )
                        ) : (
                            <tr><td colSpan="5" style={{ textAlign: 'center' }}>Vui lòng chọn một mùa giải</td></tr>
                        )}
                    </tbody>
                </table>
            </div>
            {sortedCards.length > itemsPerPage && (
                <div className={styles.pagination}>
                    <button onClick={() => paginate(currentPage - 1)} disabled={currentPage === 1}>
                        Trước
                    </button>
                    {pageNumbers.map(number => (
                        <button key={number} onClick={() => paginate(number)} className={currentPage === number ? styles.active : ''}>
                            {number}
                        </button>
                    ))}
                    <button onClick={() => paginate(currentPage + 1)} disabled={currentPage === pageNumbers.length}>
                        Sau
                    </button>
                </div>
            )}
        </div>
    );
}

export default CardsList;