import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import styles from './SeasonDetails.module.css';

function SeasonDetails({ API_URL }) {
    const { MaMuaGiai } = useParams();
    const [season, setSeason] = useState(null);
    const [teams, setTeams] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [rounds, setRounds] = useState([]);
    const [isEditRoundModalOpen, setIsEditRoundModalOpen] = useState(false);
    const [roundToEdit, setRoundToEdit] = useState(null);
    const [editRoundError, setEditRoundError] = useState('');
    const [isAddTeamsModalOpen, setIsAddTeamsModalOpen] = useState(false);
    const [availableTeamsForSeason, setAvailableTeamsForSeason] = useState([]);
    const [selectedTeamsToAdd, setSelectedTeamsToAdd] = useState([]);

    useEffect(() => {
        const fetchSeasonDetails = async () => {
            setLoading(true);
            setError(null);
            try {
                const response = await fetch(`${API_URL}/mua-giai/${MaMuaGiai}`);
                if (!response.ok) {
                    const text = await response.text();
                    console.error("HTTP Error fetching season:", response.status, response.statusText);
                    console.error("Response Body:", text);
                    throw new Error(`Could not fetch season details: ${response.status} - ${response.statusText}`);
                }
                const data = await response.json();
                setSeason(data);
            } catch (err) {
                console.error("Error fetching season details:", err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchSeasonDetails();
    }, [API_URL, MaMuaGiai]);

    useEffect(() => {
        const fetchTeamsDetails = async () => {
            if (season && season.teams && season.teams.length > 0) {
                const teamsPromises = season.teams.map(teamId =>
                    fetch(`${API_URL}/doi-bong/${teamId}`).then(res => {
                        if (!res.ok) {
                            throw new Error(`Could not fetch team details for ID ${teamId}: ${res.status}`);
                        }
                        return res.json();
                    })
                );

                try {
                    const teamsData = await Promise.all(teamsPromises);
                    console.log("Teams data received:", teamsData);
                    setTeams(teamsData);
                } catch (error) {
                    console.error("Error fetching team details:", error);
                    setError(error.message);
                }
            }
        };

        fetchTeamsDetails();
    }, [API_URL, season]);

    useEffect(() => {
        const fetchSeasonRounds = async () => {
            if (MaMuaGiai) {
                try {
                    const response = await fetch(`${API_URL}/vong-dau/${MaMuaGiai}`);
                    if (!response.ok) {
                        const message = await response.text();
                        throw new Error(`Failed to fetch rounds: ${response.status} - ${message}`);
                    }
                    const data = await response.json();
                    console.log('asasa', data);
                    setRounds(data.vongDau);
                } catch (error) {
                    console.error("Error fetching season rounds:", error);
                    setError(error.message);
                }
            }
        };

        fetchSeasonRounds();
    }, [API_URL, MaMuaGiai]);

    useEffect(() => {
        const fetchAvailableTeamsForSeason = async () => {
            try {
                const response = await fetch(`${API_URL}/doi-bong`);
                if (!response.ok) {
                    const message = await response.text();
                    throw new Error(`Failed to fetch available teams: ${response.status} - ${message}`);
                }
                const data = await response.json();
                setAvailableTeamsForSeason(data.teams);
            } catch (error) {
                console.error("Error fetching available teams:", error);
                setError(error.message);
            }
        };

        fetchAvailableTeamsForSeason();
    }, [API_URL]);

    const handleOpenEditRoundModal = (round) => {
        setRoundToEdit({ ...round });
        setEditRoundError(''); // Clear any previous error
        setIsEditRoundModalOpen(true);
    };

    const handleCloseEditRoundModal = () => {
        setIsEditRoundModalOpen(false);
        setRoundToEdit(null);
    };

    const handleEditRoundInputChange = (e) => {
        const { name, value } = e.target;
        setRoundToEdit(prevState => ({
            ...prevState,
            [name]: value,
        }));
    };

    const handleSaveEditedRound = async () => {
        setEditRoundError('');
        if (!roundToEdit.NgayBatDau || !roundToEdit.NgayKetThuc) {
            setEditRoundError('Vui lòng điền đầy đủ ngày bắt đầu và ngày kết thúc.');
            return;
        }

        if (new Date(roundToEdit.NgayBatDau) >= new Date(roundToEdit.NgayKetThuc)) {
            setEditRoundError('Ngày bắt đầu phải trước ngày kết thúc.');
            return;
        }

        try {
            const response = await fetch(`${API_URL}/vong-dau/${MaMuaGiai}/${roundToEdit.MaVongDau}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(roundToEdit),
            });

            if (!response.ok) {
                const message = await response.text();
                throw new Error(`Failed to update round: ${response.status} - ${message}`);
            }

            const updatedRound = await response.json();
            setRounds(prevRounds =>
                prevRounds.map(round =>
                    round.roundId === updatedRound.roundId ? updatedRound : round
                )
            );
            handleCloseEditRoundModal();
        } catch (error) {
            console.error("Error updating round:", error);
            setEditRoundError(error.message);
        }
    };

    const handleOpenAddTeamsModal = () => {
        setIsAddTeamsModalOpen(true);
    };

    const handleCloseAddTeamsModal = () => {
        setIsAddTeamsModalOpen(false);
        setSelectedTeamsToAdd([]);
    };

    const handleToggleTeamSelection = (teamId) => {
        setSelectedTeamsToAdd(prevSelected =>
            prevSelected.includes(teamId)
                ? prevSelected.filter(id => id !== teamId)
                : [...prevSelected, teamId]
        );
    };

    const handleAddSelectedTeams = async () => {
        if (selectedTeamsToAdd.length === 0) {
            return; // No teams selected
        }

        try {
            const response = await fetch(`${API_URL}/mua-giai/${MaMuaGiai}/teams`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ teamIds: selectedTeamsToAdd }),
            });

            if (!response.ok) {
                const message = await response.text();
                throw new Error(`Failed to add teams to season: ${response.status} - ${message}`);
            }

            // Refresh season details and teams
            const updatedSeasonResponse = await fetch(`${API_URL}/mua-giai/${MaMuaGiai}`);
            const updatedSeasonData = await updatedSeasonResponse.json();
            setSeason(updatedSeasonData);

            const teamsData = await Promise.all(updatedSeasonData.teams.map(teamId => fetch(`${API_URL}/teams/${teamId}`).then(res => res.json())));
            setTeams(teamsData);
            handleCloseAddTeamsModal();
        } catch (error) {
            console.error("Error adding teams to season:", error);
            setError(error.message);
        }
    };

    if (loading) {
        return <div className="container">Loading season details...</div>;
    }

    if (error) {
        return <div className="container error">Error: {error}</div>;
    }

    if (!season) {
        return <div className="container">Season not found.</div>;
    }

    const canAddRounds = rounds.length < 2;

    return (
        <div className={styles.container}>
            <h2 className={styles.title}>{season.TenMuaGiai}</h2>
            <p className={styles.paragraph}><strong>Mã mùa giải:</strong> {season.MaMuaGiai}</p>
            <p className={styles.paragraph}><strong>Ngày bắt đầu:</strong><strong></strong> {new Date(season.NgayBatDau).toLocaleDateString()}</p>
            <p className={styles.paragraph}><strong>Ngày kết thúc:</strong><strong></strong> {new Date(season.NgayKetThuc).toLocaleDateString()}</p>

            <div className={styles.navigationLinks}>
                <Link to={`/mua-giai/${MaMuaGiai}/bang-xep-hang`} className={styles.link}>
                    Xem Bảng Xếp Hạng
                </Link>
                <Link to={`/mua-giai/${MaMuaGiai}/vua-pha-luoi`} className={styles.link}>
                    Xem Vua Phá Lưới
                </Link>
            </div>

            <div>
                <h3 className={styles.title} style={{ fontSize: '20px' }}>Vòng đấu:</h3>
                {rounds.length > 0 ? (
                    <ul className={styles.list}>
                        {rounds.map(round => (
                            <li key={round.roundId} className={styles['list-item']}>
                                {round.LuotDau ? "Lượt về" : "Lượt đi"} (
                                {new Date(round.NgayBatDau).toLocaleDateString()} -
                                {new Date(round.NgayKetThuc).toLocaleDateString()}
                                )
                                <button onClick={() => handleOpenEditRoundModal(round)} className={styles.editButton}>Sửa</button>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p className={styles.missing}>Chưa có vòng đấu nào được tạo.</p>
                )}
                {canAddRounds && (
                    <button className={styles.addbutton}>Tạo vòng đấu</button>
                )}
                {!canAddRounds && (
                    <p className={styles.sufficient}>Đã có đủ 2 vòng đấu (Lượt đi và Lượt về).</p>
                )}
            </div>

            {isEditRoundModalOpen && (
                <div className={styles.modal}>
                    <div className={styles['modal-content']}>
                        <span className={styles.close} onClick={handleCloseEditRoundModal}>×</span>
                        <h3>Sửa vòng đấu</h3>
                        {editRoundError && <p className={styles.error}>{editRoundError}</p>}
                        <label htmlFor="editRoundId">Mã vòng đấu:</label>
                        <input
                            type="text"
                            id="editRoundId"
                            name="roundId"
                            value={roundToEdit.MaVongDau}
                            onChange={handleEditRoundInputChange}
                            className={styles['modal-input']}
                            readOnly
                        />
                        <label htmlFor="editRoundName">Tên vòng đấu:</label>
                        <input
                            type="text"
                            id="editRoundName"
                            name="name"
                            value={roundToEdit.TenVongDau}
                            onChange={handleEditRoundInputChange}
                            className={styles['modal-input']}
                        />
                        <label htmlFor="editRoundStartDate">Ngày bắt đầu:</label>
                        <input
                            type="date"
                            id="editRoundStartDate"
                            name="startDate"
                            value={roundToEdit.NgayBatDau}
                            onChange={handleEditRoundInputChange}
                            className={styles['modal-input']}
                        />
                        <label htmlFor="editRoundEndDate">Ngày kết thúc:</label>
                        <input
                            type="date"
                            id="editRoundEndDate"
                            name="endDate"
                            value={roundToEdit.NgayKetThuc}
                            onChange={handleEditRoundInputChange}
                            className={styles['modal-input']}
                        />
                        <button onClick={handleSaveEditedRound} className={styles.button}>Lưu</button>
                    </div>
                </div>
            )}

            {isAddTeamsModalOpen && (
                <div className={styles.modal}>
                    <div className={styles['modal-content']}>
                        <span className={styles.close} onClick={handleCloseAddTeamsModal}>×</span>
                        <h3>Thêm đội bóng vào mùa giải</h3>
                        {availableTeamsForSeason.length > 0 ? (
                            <ul className={styles.list}>
                                {availableTeamsForSeason.map(team => (
                                    <li key={team.id} className={styles['modal-list-item']}>
                                        <label>
                                            <input
                                                type="checkbox"
                                                checked={selectedTeamsToAdd.includes(team.id)}
                                                onChange={() => handleToggleTeamSelection(team.id)}
                                            />
                                            {team.name}
                                        </label>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p>Không có đội nào có sẵn để thêm.</p>
                        )}
                        <button onClick={handleAddSelectedTeams} className={styles.button}>Thêm đội đã chọn</button>
                    </div>
                </div>
            )}
            {teams.length > 0 ? (
                <div>
                    <h3 className={styles.title} style={{ fontSize: '20px' }}>
                        Các đội tham gia:
                        </h3>
                        <button onClick={handleOpenAddTeamsModal} className={styles['add-team-button']} style={{ marginLeft: '10px', fontSize: '14px' }}>
                            Thêm đội bóng
                        </button>
                    <ul className={styles.list}>
                        {teams.map(team => (
                            <li key={team.id} className={styles['list-item']}>
                                <Link to={`/teams/${team.id}`} className={styles.teamLink}>
                                    {team.name}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>
            ) : (
                <div>
                    <p className={styles.paragraph}>Không có đội nào tham gia mùa giải này.</p>
                    <button onClick={handleOpenAddTeamsModal} className={styles["addteambutton"]}>Thêm đội bóng</button>
                </div>
            )}
        </div>
    );
}

export default SeasonDetails;