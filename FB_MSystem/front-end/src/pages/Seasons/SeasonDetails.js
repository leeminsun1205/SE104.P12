import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import styles from './SeasonDetails.module.css';

function SeasonDetails({ API_URL }) {
    const { seasonId } = useParams();
    const [season, setSeason] = useState(null);
    const [teams, setTeams] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [rounds, setRounds] = useState([]);
    const [isAddRoundsModalOpen, setIsAddRoundsModalOpen] = useState(false);
    const [isEditRoundModalOpen, setIsEditRoundModalOpen] = useState(false);
    const [roundToEdit, setRoundToEdit] = useState(null);
    const [newRounds, setNewRounds] = useState([
        { roundId: '', name: 'Lượt đi', startDate: '', endDate: '' },
        { roundId: '', name: 'Lượt về', startDate: '', endDate: '' },
    ]);
    const [addRoundsError, setAddRoundsError] = useState('');
    const [editRoundError, setEditRoundError] = useState('');

    useEffect(() => {
        const fetchSeasonDetails = async () => {
            setLoading(true);
            setError(null);
            try {
                const response = await fetch(`${API_URL}/seasons/${seasonId}`);
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
    }, [API_URL, seasonId]);

    useEffect(() => {
        const fetchTeamsDetails = async () => {
            if (season && season.teams && season.teams.length > 0) {
                const teamsPromises = season.teams.map(teamId =>
                    fetch(`${API_URL}/teams/${teamId}`).then(res => {
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
            if (seasonId) {
                try {
                    const response = await fetch(`${API_URL}/seasons/${seasonId}/rounds`);
                    if (!response.ok) {
                        const message = await response.text();
                        throw new Error(`Failed to fetch rounds: ${response.status} - ${message}`);
                    }
                    const data = await response.json();
                    setRounds(data.rounds);
                } catch (error) {
                    console.error("Error fetching season rounds:", error);
                    setError(error.message);
                }
            }
        };

        fetchSeasonRounds();
    }, [API_URL, seasonId]);

    const generateRoundId = (roundNumber) => {
        if (!season) return '';
        const startYear = new Date(season.startDate).getFullYear();
        const endYear = new Date(season.endDate).getFullYear();
        return `${startYear}-${endYear}-ROUND${roundNumber}`;
    };

    const handleOpenAddRoundsModal = () => {
        if (season) {
            const startYear = new Date(season.startDate).getFullYear();
            const endYear = new Date(season.endDate).getFullYear();
            setNewRounds([
                { roundId: `${startYear}-${endYear}-ROUND1`, name: 'Lượt đi', startDate: '', endDate: '' },
                { roundId: `${startYear}-${endYear}-ROUND2`, name: 'Lượt về', startDate: '', endDate: '' },
            ]);
            setAddRoundsError('');
            setIsAddRoundsModalOpen(true);
        }
    };

    const handleCloseAddRoundsModal = () => {
        setIsAddRoundsModalOpen(false);
    };

    const handleAddRoundsInputChange = (index, e) => {
        const { name, value } = e.target;
        setNewRounds(prevRounds => {
            const updatedRounds = [...prevRounds];
            updatedRounds[index] = { ...updatedRounds[index], [name]: value };
            return updatedRounds;
        });
    };

    const handleAddRounds = async () => {
        setAddRoundsError('');
        const [round1, round2] = newRounds;

        if (!round1.startDate || !round1.endDate || !round2.startDate || !round2.endDate) {
            setAddRoundsError('Vui lòng điền đầy đủ ngày bắt đầu và ngày kết thúc cho cả hai lượt.');
            return;
        }

        if (new Date(round1.startDate) >= new Date(round1.endDate)) {
            setAddRoundsError('Ngày bắt đầu lượt đi phải trước ngày kết thúc.');
            return;
        }

        if (new Date(round2.startDate) >= new Date(round2.endDate)) {
            setAddRoundsError('Ngày bắt đầu lượt về phải trước ngày kết thúc.');
            return;
        }

        if (new Date(round2.startDate) <= new Date(round1.endDate)) {
            setAddRoundsError('Lượt về phải diễn ra sau khi lượt đi kết thúc.');
            return;
        }

        try {
            const response = await fetch(`${API_URL}/seasons/${seasonId}/rounds`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newRounds),
            });

            if (!response.ok) {
                const message = await response.text();
                throw new Error(`Failed to add rounds: ${response.status} - ${message}`);
            }

            const data = await response.json();
            setRounds(prevRounds => [...prevRounds, ...data.rounds]);
            handleCloseAddRoundsModal();
        } catch (error) {
            console.error("Error adding rounds:", error);
            setAddRoundsError(error.message);
        }
    };

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
        if (!roundToEdit.startDate || !roundToEdit.endDate) {
            setEditRoundError('Vui lòng điền đầy đủ ngày bắt đầu và ngày kết thúc.');
            return;
        }

        if (new Date(roundToEdit.startDate) >= new Date(roundToEdit.endDate)) {
            setEditRoundError('Ngày bắt đầu phải trước ngày kết thúc.');
            return;
        }

        try {
            const response = await fetch(`${API_URL}/seasons/${seasonId}/rounds/${roundToEdit.roundId}`, {
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
            <h2 className={styles.title}>{season.name}</h2>
            <p className={styles.paragraph}>Mã mùa giải: {season.id}</p>
            <p className={styles.paragraph}>Ngày bắt đầu: {new Date(season.startDate).toLocaleDateString()}</p>
            <p className={styles.paragraph}>Ngày kết thúc: {new Date(season.endDate).toLocaleDateString()}</p>

            <div>
                <h3 className={styles.title} style={{ fontSize: '20px' }}>Vòng đấu:</h3>
                {rounds.length > 0 ? (
                    <ul className={styles.list}>
                        {rounds.map(round => (
                            <li key={round.roundId} className={styles['list-item']}>
                                {round.name} (
                                {new Date(round.startDate).toLocaleDateString()} -
                                {new Date(round.endDate).toLocaleDateString()}
                                )
                                <button onClick={() => handleOpenEditRoundModal(round)} className={styles.editButton}>Sửa</button>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p className={styles.missing}>Chưa có vòng đấu nào được tạo.</p>
                )}
                {canAddRounds && (
                    <button onClick={handleOpenAddRoundsModal} className={styles.button}>Thêm vòng đấu</button>
                )}
                {!canAddRounds && (
                    <p className={styles.sufficient}>Đã có đủ 2 vòng đấu (Lượt đi và Lượt về).</p>
                )}
            </div>

            {isAddRoundsModalOpen && (
                <div className={styles.modal}>
                    <div className={styles['modal-content']}>
                        <span className={styles.close} onClick={handleCloseAddRoundsModal}>×</span>
                        <h3>Thêm vòng đấu</h3>
                        {addRoundsError && <p className={styles.error}>{addRoundsError}</p>}
                        {newRounds.map((round, index) => (
                            <div key={index}>
                                <h4>{index === 0 ? 'Lượt đi' : 'Lượt về'}</h4>
                                <label htmlFor={`roundId-${index}`}>Mã vòng đấu:</label>
                                <input
                                    type="text"
                                    id={`roundId-${index}`}
                                    name="roundId"
                                    value={round.roundId}
                                    readOnly
                                    className={styles['modal-input']}
                                />
                                <label htmlFor={`roundStartDate-${index}`}>Ngày bắt đầu:</label>
                                <input
                                    type="date"
                                    id={`roundStartDate-${index}`}
                                    name="startDate"
                                    value={round.startDate}
                                    onChange={(e) => handleAddRoundsInputChange(index, e)}
                                    className={styles['modal-input']}
                                />
                                <label htmlFor={`roundEndDate-${index}`}>Ngày kết thúc:</label>
                                <input
                                    type="date"
                                    id={`roundEndDate-${index}`}
                                    name="endDate"
                                    value={round.endDate}
                                    onChange={(e) => handleAddRoundsInputChange(index, e)}
                                    className={styles['modal-input']}
                                />
                            </div>
                        ))}
                        <button onClick={handleAddRounds} className={styles.button}>Thêm</button>
                    </div>
                </div>
            )}

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
                            value={roundToEdit.roundId}
                            onChange={handleEditRoundInputChange}
                            className={styles['modal-input']}
                            readOnly
                        />
                        <label htmlFor="editRoundName">Tên vòng đấu:</label>
                        <input
                            type="text"
                            id="editRoundName"
                            name="name"
                            value={roundToEdit.name}
                            onChange={handleEditRoundInputChange}
                            className={styles['modal-input']}
                        />
                        <label htmlFor="editRoundStartDate">Ngày bắt đầu:</label>
                        <input
                            type="date"
                            id="editRoundStartDate"
                            name="startDate"
                            value={roundToEdit.startDate}
                            onChange={handleEditRoundInputChange}
                            className={styles['modal-input']}
                        />
                        <label htmlFor="editRoundEndDate">Ngày kết thúc:</label>
                        <input
                            type="date"
                            id="editRoundEndDate"
                            name="endDate"
                            value={roundToEdit.endDate}
                            onChange={handleEditRoundInputChange}
                            className={styles['modal-input']}
                        />
                        <button onClick={handleSaveEditedRound} className={styles.button}>Lưu</button>
                    </div>
                </div>
            )}

            {teams.length > 0 ? (
                <div>
                    <h3 className={styles.title} style={{ fontSize: '20px' }}>Các đội tham gia:</h3>
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
                <p className={styles.paragraph}>Không có đội nào tham gia mùa giải này.</p>
            )}
        </div>
    );
}

export default SeasonDetails;