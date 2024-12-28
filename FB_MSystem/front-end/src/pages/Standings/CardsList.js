// --- START OF FILE CardsList.js ---
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

    useEffect(() => {
        const fetchSeasons = async () => {
            try {
                const response = await fetch(`${API_URL}/mua-giai`);
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();
                setAvailableSeasons(data.muaGiai.filter(season => season !== 'all'));
            } catch (error) {
                console.error("Error fetching seasons:", error);
                setError("Failed to load seasons.");
            }
        };

        fetchSeasons();
    }, [API_URL]);

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
                const response = await fetch(`${API_URL}/ds-the-phat/mua-giai/${selectedSeason}`);
                if (!response.ok) {
                    if (response.status === 404) {
                        setNotFound(true);
                        setCards([]);
                    } else {
                        throw new Error(`HTTP error! status: ${response.status}`);
                    }
                    return;
                }
                const data = await response.json();
                setCards(data);
            } catch (error) {
                console.error("Error fetching card data:", error);
                setError("Failed to load card data.");
                setCards([]);
            } finally {
                setLoading(false);
                setCurrentPage(1);
            }
        };

        fetchCardsData();
    }, [selectedSeason, API_URL]);

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

    const handlePlayerClick = (playerId) => {
        navigate(`/cau-thu/${playerId}`);
    };

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
                            <th onClick={() => requestSort('CauThu.TenCauThu')}>Cầu thủ {getSortIndicator('CauThu.TenCauThu')}</th>
                            <th onClick={() => requestSort('SoTheVang')}>Số thẻ vàng {getSortIndicator('SoTheVang')}</th>
                            <th onClick={() => requestSort('SoTheDo')}>Số thẻ đỏ {getSortIndicator('SoTheDo')}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {selectedSeason ? (
                            currentItems.length > 0 ? (
                                currentItems.map((card, index) => (
                                    <tr key={`${index}-${card.MaCauThu}-${card.MaVongDau}`}>
                                        <td>{(currentPage - 1) * itemsPerPage + index + 1}</td>
                                        <td
                                            className={`${styles.playerName} ${styles.clickable}`}
                                            onClick={() => handlePlayerClick(card.CauThu?.MaCauThu)}
                                        >
                                            {card.CauThu?.TenCauThu || 'Không rõ'}
                                        </td>
                                        <td>{card.SoTheVang}</td>
                                        <td>{card.SoTheDo}</td>
                                    </tr>
                                ))
                            ) : loading ? (
                                <tr><td colSpan="4" style={{ textAlign: 'center' }}>Đang tải dữ liệu thẻ phạt...</td></tr>
                            ) : notFound ? (
                                <tr><td colSpan="4" style={{ textAlign: 'center' }}>Không tìm thấy dữ liệu thẻ phạt cho mùa giải này.</td></tr>
                            ) : error ? (
                                <tr><td colSpan="4" style={{ textAlign: 'center' }}>Lỗi: {error}</td></tr>
                            ) : (
                                <tr><td colSpan="4" style={{ textAlign: 'center' }}>Không có dữ liệu cho mùa giải này.</td></tr>
                            )
                        ) : (
                            <tr><td colSpan="4" style={{ textAlign: 'center' }}>Vui lòng chọn một mùa giải</td></tr>
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