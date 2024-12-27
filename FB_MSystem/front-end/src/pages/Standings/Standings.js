// Standings.js
import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './Standings.module.css';
import SeasonSelector from '../../components/SeasonSelector/SeasonSelector';

function Standings({ API_URL }) {
    const navigate = useNavigate();
    const [selectedSeason, setSelectedSeason] = useState('');
    const [standings, setStandings] = useState([]);
    const [seasonsStandings, setSeasonsStandings] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [notFound, setNotFound] = useState(false);
    const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' });
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5; // You can adjust this value

    useEffect(() => {
        const fetchSeasons = async () => {
            try {
                const response = await fetch(`${API_URL}/mua-giai`);
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();
                setSeasonsStandings(data.seasons.filter(season => season !== 'all'));
            } catch (error) {
                console.error("Error fetching seasons:", error);
                setError("Failed to load seasons.");
            }
        };

        fetchSeasons();
    }, [API_URL]); // Added API_URL to dependency array

    useEffect(() => {
        if (!selectedSeason) {
            setStandings([]);
            setSortConfig({ key: null, direction: 'ascending' });
            setNotFound(false);
            return;
        }

        const fetchStandings = async () => {
            setLoading(true);
            setError(null);
            setNotFound(false);
            try {
                const response = await fetch(`${API_URL}/bang-xep-hang/mua-giai/${selectedSeason}`);
                if (!response.ok) {
                    if (response.status === 404) {
                        console.log(`Standings not found for season: ${selectedSeason}`);
                        setNotFound(true);
                        setStandings([]);
                    } else {
                        throw new Error(`HTTP error! status: ${response.status}`);
                    }
                    return;
                }
                const data = await response.json();
                console.log("Dữ liệu bảng xếp hạng từ API:", data); // Debug API response
                setStandings(data);
            } catch (error) {
                console.error("Lỗi khi fetch bảng xếp hạng:", error);
                setError("Failed to load standings.");
                setStandings([]);
            } finally {
                setLoading(false);
                setCurrentPage(1); // Reset to first page when season changes
            }
        };

        fetchStandings();
    }, [selectedSeason, API_URL]); // Added API_URL to dependency array

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

    const sortedStandings = useMemo(() => {
        const sortableStandings = [...standings];
        if (sortConfig.key !== null) {
            sortableStandings.sort((a, b) => {
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
        return sortableStandings;
    }, [standings, sortConfig]);

    const getSortIndicator = (key) => {
        if (sortConfig.key === key) {
            return sortConfig.direction === 'ascending' ? "↑" : "↓";
        }
        return "";
    };

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = sortedStandings.slice(indexOfFirstItem, indexOfLastItem);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    const pageNumbers = [];
    for (let i = 1; i <= Math.ceil(sortedStandings.length / itemsPerPage); i++) {
        pageNumbers.push(i);
    }

    if (loading) {
        return <div>Đang tải dữ liệu bảng xếp hạng...</div>;
    }

    if (error) {
        return <div>Lỗi: {error}</div>;
    }

    const handleRowClick = (teamId, seasonId) => {
        console.log(`handleRowClick - Team ID: ${teamId}, Season ID: ${seasonId}`); // Debug handleRowClick
        navigate(`/doi-bong/${teamId}/mua-giai/${seasonId}`);
    };

    return (
        <div className={styles.standingsContainer}>
            <h2 className={styles.standingsTitle}>Bảng xếp hạng</h2>
            {seasonsStandings.length > 0 && (
                <SeasonSelector
                    onSeasonChange={handleSeasonChange}
                    seasons={seasonsStandings}
                    selectedSeason={selectedSeason}
                />
            )}

            <div className={styles.tableWrapper}>
                <table className={styles.standingsTable}>
                    <thead>
                        <tr>
                            <th onClick={() => requestSort('rank')}>Hạng {getSortIndicator('rank')}</th>
                            <th onClick={() => requestSort('name')}>Đội {getSortIndicator('name')}</th>
                            <th onClick={() => requestSort('played')}>Trận {getSortIndicator('played')}</th>
                            <th onClick={() => requestSort('won')}>Thắng {getSortIndicator('won')}</th>
                            <th onClick={() => requestSort('drawn')}>Hòa {getSortIndicator('drawn')}</th>
                            <th onClick={() => requestSort('lost')}>Thua {getSortIndicator('lost')}</th>
                            <th onClick={() => requestSort('goalsFor')}>Bàn thắng {getSortIndicator('goalsFor')}</th>
                            <th onClick={() => requestSort('goalsAgainst')}>Bàn thua {getSortIndicator('goalsAgainst')}</th>
                            <th onClick={() => requestSort('goalDifference')}>Hiệu số {getSortIndicator('goalDifference')}</th>
                            <th onClick={() => requestSort('points')}>Điểm {getSortIndicator('points')}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {selectedSeason ? (
                            currentItems.length > 0 ? (
                                currentItems.map((team) => {
                                    console.log("Đội trong map:", team); // Debug team object in map
                                    return (
                                        <tr
                                            key={`${team.rank}-${team.name}-${team.season}`}
                                            onClick={() => handleRowClick(team.id, selectedSeason)}
                                            className={styles.standingsRow}
                                        >
                                            <td>{team.rank}</td>
                                            <td className={styles.teamName}>{team.name}</td>
                                            <td>{team.played}</td>
                                            <td>{team.won}</td>
                                            <td>{team.drawn}</td>
                                            <td>{team.lost}</td>
                                            <td>{team.goalsFor}</td>
                                            <td>{team.goalsAgainst}</td>
                                            <td>{team.goalDifference}</td>
                                            <td>{team.points}</td>
                                        </tr>
                                    );
                                })
                            ) : loading ? (
                                <tr><td colSpan="10" style={{ textAlign: 'center' }}>Đang tải dữ liệu bảng xếp hạng...</td></tr>
                            ) : notFound ? (
                                <tr><td colSpan="10" style={{ textAlign: 'center' }}>Không tìm thấy bảng xếp hạng cho mùa giải này.</td></tr>
                            ) : error ? (
                                <tr><td colSpan="10" style={{ textAlign: 'center' }}>Lỗi: {error}</td></tr>
                            ) : (
                                <tr><td colSpan="10" style={{ textAlign: 'center' }}>Không có dữ liệu cho mùa giải này.</td></tr>
                            )
                        ) : (
                            <tr><td colSpan="10" style={{ textAlign: 'center' }}>Vui lòng chọn một mùa giải</td></tr>
                        )}
                    </tbody>
                </table>
            </div>
            {sortedStandings.length > itemsPerPage && (
                <div className={styles.pagination}>
                    {pageNumbers.map(number => (
                        <button key={number} onClick={() => paginate(number)} className={currentPage === number ? styles.active : ''}>
                            {number}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}

export default Standings;