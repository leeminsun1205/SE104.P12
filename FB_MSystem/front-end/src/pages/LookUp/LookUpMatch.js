import React, { useState, useMemo, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import TeamSelector from "../../components/TeamSelector/TeamSelector";
import styles from "./LookUpMatch.module.css";
import SeasonSelector from "../../components/SeasonSelector/SeasonSelector"; // Adjust path if necessary

function LookUpMatch({ API_URL }) {
    const [matches, setMatches] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [availableTeams, setAvailableTeams] = useState([]);
    const [selectedTeam, setSelectedTeam] = useState("");
    const [sortConfig, setSortConfig] = useState({
        key: "NgayThiDau",
        direction: "ascending",
    });
    const [searchQuery, setSearchQuery] = useState("");
    const navigate = useNavigate();
    const [hasUserInteracted, setHasUserInteracted] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const matchesPerPage = 5;
    const [seasons, setSeasons] = useState([]);
    const [selectedSeason, setSelectedSeason] = useState('');

    useEffect(() => {
        const fetchSeasons = async () => {
            try {
                const response = await fetch(`${API_URL}/mua-giai`);
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();
                setSeasons(data.muaGiai);
            } catch (error) {
                console.error("Error fetching seasons:", error);
            }
        };
        fetchSeasons();
    }, [API_URL]);

    useEffect(() => {
        const fetchTeams = async () => {
            try {
                const response = await fetch(`${API_URL}/doi-bong`);
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();
                setAvailableTeams(data.doiBong);
            } catch (error) {
                console.error("Lỗi khi tải danh sách đội bóng:", error);
            }
        };

        fetchTeams();
    }, [API_URL]);

    useEffect(() => {
        if (availableTeams.length > 0 && !selectedTeam) {
            const trySetDefaultTeam = async () => {
                for (const team of availableTeams) {
                    try {
                        setLoading(true);
                        setError(null);
                        const response = await fetch(`${API_URL}/tran-dau/doi-bong/${team.MaDoiBong}${selectedSeason ? `?maMuaGiai=${selectedSeason}` : ''}`);
                        if (response.ok) {
                            setSelectedTeam(team.MaDoiBong);
                            return; // Exit the loop once a valid team is found
                        } else {
                            console.warn(`Lỗi khi tải trận đấu cho đội ${team.TenDoiBong} (mặc định): ${response.status}`);
                        }
                    } catch (err) {
                        console.error(`Lỗi khi tải trận đấu cho đội ${team.TenDoiBong} (mặc định):`, err);
                    } finally {
                        setLoading(false);
                    }
                }
            };
            trySetDefaultTeam();
        }
    }, [availableTeams, API_URL, selectedTeam, selectedSeason]);

    useEffect(() => {
        if (selectedTeam && selectedSeason) {
            const fetchMatches = async () => {
                setLoading(true);
                setError(null);
                try {
                    const response = await fetch(
                        `${API_URL}/tran-dau/doi-bong/${selectedTeam}?maMuaGiai=${selectedSeason}`
                    );
                    if (!response.ok) {
                        if (response.status === 404 && hasUserInteracted) {
                            setError("Không có thông tin trận đấu về đội bóng này trong mùa giải đã chọn.");
                        } else if (response.status !== 404) {
                            throw new Error(`HTTP error! status: ${response.status}`);
                        }
                        setMatches([]);
                    } else {
                        const data = await response.json();
                        setMatches(data.tranDau);
                        setError(null);
                        setCurrentPage(1);
                    }
                } catch (e) {
                    setError("Lỗi khi tải thông tin trận đấu.");
                    setMatches([]);
                } finally {
                    setLoading(false);
                }
            };
            fetchMatches();
        } else {
            setMatches([]);
            setError(null);
        }
    }, [API_URL, selectedTeam, hasUserInteracted, selectedSeason]);

    const filteredMatches = useMemo(() => {
        return matches
            .filter((match) =>
                selectedTeam ? match.DoiBongNha.MaDoiBong === selectedTeam || match.DoiBongKhach.MaDoiBong === selectedTeam : false
            )
            .filter((match) => {
                const query = searchQuery.toLowerCase();
                return (
                    match.DoiBongNha.TenDoiBong.toLowerCase().includes(query) ||
                    match.DoiBongKhach.TenDoiBong.toLowerCase().includes(query) ||
                    match.SanThiDau.TenSan.toLowerCase().includes(query) ||
                    match.NgayThiDau.includes(query) ||
                    match.VongDau.MaVongDau.toLowerCase().includes(query)
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
    }, [matches, selectedTeam, searchQuery, sortConfig]);

    const handleTeamsChange = (teamId) => {
        setSelectedTeam(teamId);
        setHasUserInteracted(true);
        setError(null);
    };

    const handleSeasonChange = (seasonId) => {
        setSelectedSeason(seasonId);
        setSelectedTeam(''); // Reset selected team when season changes
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

    const indexOfLastMatch = currentPage * matchesPerPage;
    const indexOfFirstMatch = indexOfLastMatch - matchesPerPage;
    const currentMatches = useMemo(() => filteredMatches.slice(indexOfFirstMatch, indexOfLastMatch), [filteredMatches, currentPage]);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    const pageNumbers = useMemo(() => {
        const pages = [];
        for (let i = 1; i <= Math.ceil(filteredMatches.length / matchesPerPage); i++) {
            pages.push(i);
        }
        return pages;
    }, [filteredMatches.length, matchesPerPage]);

    if (loading) {
        return <div>Đang tải danh sách trận đấu...</div>;
    }

    return (
        <div className={styles.matchesPage}>
            <div className={styles.header}>
                <h2 className={styles.matchesTitle}>Tra cứu trận đấu</h2>
                <Link to="/tra-cuu" className={styles.backButton}>
                    Quay lại
                </Link>
            </div>
            <SeasonSelector
                seasons={seasons}
                onSeasonChange={handleSeasonChange}
                selectedSeason={selectedSeason}
            />
            <div className={styles.filterContainer}>
                {/* Teams Selector */}
                <div className={styles.TeamSelector}>
                    <TeamSelector
                        onTeamsChange={handleTeamsChange}
                        teams={availableTeams.map(team => ({ id: team.MaDoiBong, name: team.TenDoiBong }))}
                        selectedTeam={selectedTeam}
                        id="teams"
                    />
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

            {selectedSeason === '' ? (
                <h2 className={styles.matchesTitle}>Vui lòng chọn một mùa giải</h2>
            ) : selectedTeam === "" ? (
                <h2 className={styles.matchesTitle}>Vui lòng chọn một đội bóng</h2>
            ) : (
                <>
                    {error ? (
                        <div className={styles.noMatches}>{error}</div>
                    ) : currentMatches.length === 0 && !loading ? (
                        <div className={styles.noMatches}>Không có thông tin trận đấu về đội bóng này trong mùa giải đã chọn.</div>
                    ) : (
                        <>
                            <table className={styles.matchesTable}>
                                <thead>
                                    <tr>
                                        {[
                                            "NgayThiDau",
                                            "GioThiDau",
                                            "DoiBongNha",
                                            "DoiBongKhach",
                                            "SanThiDau",
                                            "VongDau",
                                            "actions",
                                        ].map(
                                            (key) =>
                                                key !== "actions" && (
                                                    <th
                                                        key={key}
                                                        className={styles.headerCell}
                                                        onClick={() => handleSort(key)}
                                                    >
                                                        {key === 'NgayThiDau' ? 'Ngày thi đấu' :
                                                            key === 'GioThiDau' ? 'Giờ' :
                                                                key === 'DoiBongNha' ? 'Đội nhà' :
                                                                    key === 'DoiBongKhach' ? 'Đội khách' :
                                                                        key === 'SanThiDau' ? 'Sân thi đấu' :
                                                                            key === 'VongDau' ? 'Vòng đấu' : ''
                                                        }
                                                        {" "}
                                                        {getSortIndicator(key)}
                                                    </th>
                                                )
                                        )}
                                    </tr>
                                </thead>
                                <tbody>
                                    {currentMatches.map((match) => (
                                        <tr
                                            key={match.MaTranDau}
                                            className={styles.row}
                                            onClick={() =>
                                                navigate(`/match/${match.VongDau.MaMuaGiai}/${match.VongDau.MaVongDau}/${match.MaTranDau}`)
                                            }
                                        >
                                            <td className={styles.cell}>{match.NgayThiDau}</td>
                                            <td className={styles.cell}>{match.GioThiDau}</td>
                                            <td className={styles.cell}>{match.DoiBongNha.TenDoiBong}</td>
                                            <td className={styles.cell}>{match.DoiBongKhach.TenDoiBong}</td>
                                            <td className={styles.cell}>{match.SanThiDau.TenSan}</td>
                                            <td className={styles.cell}>{match.VongDau.MaVongDau}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            <div className={styles.pagination}>
                                {pageNumbers.map(number => (
                                    <button key={number} onClick={() => paginate(number)} className={currentPage === number ? styles.active : ''}>
                                        {number}
                                    </button>
                                ))}
                            </div>
                        </>
                    )}
                </>
            )}
        </div>
    );
}

export default LookUpMatch;