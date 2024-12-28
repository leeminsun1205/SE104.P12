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
    const [isCreatingRound, setIsCreatingRound] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [priority, setPriority] = useState([]);
    const [isEditPriorityModalOpen, setIsEditPriorityModalOpen] = useState(false);
    const [editedPriority, setEditedPriority] = useState([]);
    const [editPriorityError, setEditPriorityError] = useState('');
    const teamsPerPage = 5;

    useEffect(() => {
        const fetchPriority = async () => {
            setLoading(true);
            setError(null);
            try {
                const response = await fetch(`${API_URL}/ut-xep-hang/mua-giai/${MaMuaGiai}`);
                if (!response.ok) {
                    const text = await response.text();
                    console.error("HTTP Error fetching season:", response.status, response.statusText);
                    console.error("Response Body:", text);
                    throw new Error(`Could not fetch season details: ${response.status} - ${response.statusText}`);
                }
                const data = await response.json();
                setPriority(data);
                setEditedPriority(data.sort((a, b) => a.MucDoUuTien - b.MucDoUuTien)); // Initialize editedPriority with fetched data
            } catch (err) {
                console.error("Error fetching season details:", err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchPriority();
    }, [API_URL, MaMuaGiai]);

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
                setSeason(data.muaGiai);
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
        const fetchTeamsForSeason = async () => {
            if (season && season.MaMuaGiai) {
                setLoading(true);
                setError(null);
                try {
                    const response = await fetch(`${API_URL}/mg-db/mua-giai/${season.MaMuaGiai}/doi-bong`);
                    if (!response.ok) {
                        const message = await response.text();
                        throw new Error(`Failed to fetch teams for season: ${response.status} - ${message}`);
                    }
                    const data = await response.json();
                    setTeams(data || []);
                } catch (error) {
                    console.error("Error fetching teams for season:", error);
                    setError(error.message);
                } finally {
                    setLoading(false);
                }
            }
        };

        fetchTeamsForSeason();
    }, [API_URL, season]);

    useEffect(() => {
        const fetchSeasonRounds = async () => {
            if (MaMuaGiai) {
                setLoading(true);
                setError(null);
                try {
                    const response = await fetch(`${API_URL}/vong-dau/${MaMuaGiai}`);
                    if (!response.ok) {
                        if (response.status === 404) {
                            setRounds([]);
                            return
                        }
                        const message = await response.text();
                        throw new Error(`Failed to fetch rounds: ${response.status} - ${message}`);
                    }
                    const data = await response.json();
                    setRounds(data.vongDau);
                } catch (error) {
                    console.error("Error fetching season rounds:", error);
                    setError(error.message);
                } finally {
                    setLoading(false);
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
                setAvailableTeamsForSeason(data.doiBong);
            } catch (error) {
                console.error("Error fetching available teams:", error);
                setError(error.message);
            }
        };

        fetchAvailableTeamsForSeason();
    }, [API_URL]);

    const handleOpenEditRoundModal = (round) => {
        setRoundToEdit({ ...round });
        setEditRoundError('');
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
                    round.MaVongDau === updatedRound.MaVongDau ? updatedRound : round
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
        setCurrentPage(1);
    };

    const handleCloseAddTeamsModal = () => {
        setIsAddTeamsModalOpen(false);
        setSelectedTeamsToAdd([]);
    };

    const handleToggleTeamSelection = (MaDoiBong) => {
        setSelectedTeamsToAdd(prevSelected => {
            const isSelected = prevSelected.some(item => item.MaDoiBong === MaDoiBong);
            if (isSelected) {
                return prevSelected.filter(item => item.MaDoiBong !== MaDoiBong);
            } else {
                return [...prevSelected, { MaMuaGiai: MaMuaGiai, MaDoiBong: MaDoiBong }];
            }
        });
    };
    const handlePageClick = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const handleAddSelectedTeams = async () => {
        if (selectedTeamsToAdd.length === 0) {
            return;
        }

        try {
            const response = await fetch(`${API_URL}/mg-db/CreateMany`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({links: selectedTeamsToAdd}),
            });
            if (!response.ok) {
                const message = await response.text();
                throw new Error(`Failed to add teams to season: ${response.status} - ${message}`);
            }

            const updatedSeasonResponse = await fetch(`${API_URL}/mua-giai/${MaMuaGiai}`);
            const updatedSeasonData = await updatedSeasonResponse.json();
            setSeason(updatedSeasonData.muaGiai);
            setTeams(prevTeams => [...prevTeams, ...selectedTeamsToAdd]);
            handleCloseAddTeamsModal();
        } catch (error) {
            console.error("Error adding teams to season:", error);
            setError(error.message);
        }
    };

    const handleCreateRound = async () => {
        setIsCreatingRound(true);
        setError(null);
        try {
            const response = await fetch(`${API_URL}/vong-dau/${MaMuaGiai}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                const message = await response.text();
                throw new Error(`Failed to create round: ${response.status} - ${message}`);
            }
            const updatedRoundsResponse = await fetch(`${API_URL}/vong-dau/${MaMuaGiai}`);
            if (updatedRoundsResponse.ok) {
                const updatedRoundsData = await updatedRoundsResponse.json();
                setRounds(updatedRoundsData.vongDau);
            }
        } catch (error) {
            console.error("Error creating round:", error);
            setError(error.message);
        } finally {
            setIsCreatingRound(false);
        }
    };

    const handleOpenEditPriorityModal = () => {
        setEditPriorityError('');
        setIsEditPriorityModalOpen(true);
    };

    const handleCloseEditPriorityModal = () => {
        setIsEditPriorityModalOpen(false);
    };

    const handlePriorityInputChange = (index, value) => {
        const newValue = parseInt(value, 10);
        if (newValue >= 1 && newValue <= 3) {
            const newPriority = [...editedPriority];
            const currentValue = newPriority[index].MucDoUuTien;
            newPriority[index].MucDoUuTien = newValue;

            // Check for duplicates and resolve
            newPriority.forEach((item, i) => {
                if (i !== index && item.MucDoUuTien === newValue) {
                    // If the new value is taken, push the existing one
                    if (currentValue < newValue) {
                        item.MucDoUuTien = currentValue; // Move the existing one down
                    } else {
                        item.MucDoUuTien = currentValue; // Move the existing one up
                    }
                }
            });

            // Ensure no other duplicates are created by the shifting
            const seen = {};
            for (let i = 0; i < newPriority.length; i++) {
                if (seen[newPriority[i].MucDoUuTien]) {
                    // Find another available slot (simplistic approach, can be improved)
                    for (let j = 1; j <= 3; j++) {
                        if (!seen[j]) {
                            newPriority[i].MucDoUuTien = j;
                            break;
                        }
                    }
                }
                seen[newPriority[i].MucDoUuTien] = true;
            }

            setEditedPriority(newPriority.sort((a, b) => a.MaLoaiUuTien - b.MaLoaiUuTien)); // Keep original order
        }
    };

    const handleSavePriority = async () => {
        setEditPriorityError('');
        const priorities = editedPriority.map(p => ({
            MaLoaiUuTien: p.MaLoaiUuTien,
            MucDoUuTien: p.MucDoUuTien
        }));

        // Check for duplicates before saving
        const seenPriorities = new Set();
        for (const p of priorities) {
            if (seenPriorities.has(p.MucDoUuTien)) {
                setEditPriorityError('Mỗi mức độ ưu tiên chỉ được gán cho một tiêu chí.');
                return;
            }
            seenPriorities.add(p.MucDoUuTien);
        }

        try {
            const response = await fetch(`${API_URL}/ut-xep-hang/mua-giai/${MaMuaGiai}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ tieuChi: priorities }),
            });

            if (!response.ok) {
                const message = await response.text();
                throw new Error(`Failed to update ranking priority: ${response.status} - ${message}`);
            }

            const updatedPriorityResponse = await fetch(`${API_URL}/ut-xep-hang/mua-giai/${MaMuaGiai}`);
            if (!updatedPriorityResponse.ok) {
                const message = await updatedPriorityResponse.text();
                throw new Error(`Failed to fetch updated ranking priority: ${updatedPriorityResponse.status} - ${message}`);
            }
            const updatedPriorityData = await updatedPriorityResponse.json();
            setPriority(updatedPriorityData);
            handleCloseEditPriorityModal();

        } catch (error) {
            console.error("Error updating ranking priority:", error);
            setEditPriorityError(error.message);
        }
    };

    if (loading) {
        return <div className="container">Đang tải chi tiết mùa giải...</div>;
    }

    if (error) {
        return <div className="container error">Lỗi: {error}</div>;
    }

    if (!season) {
        return <div className="container">Không tìm thấy mùa giải.</div>;
    }
    const indexOfLastTeam = currentPage * teamsPerPage;
    const indexOfFirstTeam = indexOfLastTeam - teamsPerPage;
    const currentTeams = availableTeamsForSeason.slice(indexOfFirstTeam, indexOfLastTeam);
    const totalPages = Math.ceil(availableTeamsForSeason.length / teamsPerPage);
    const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);

    return (
        <div className={styles.container}>
            <h2 className={styles.title}>Mùa giải {season.TenMuaGiai}</h2>
            <p className={styles.paragraph}><strong>Mã mùa giải:</strong> {season.MaMuaGiai}</p>
            <p className={styles.paragraph}><strong>Ngày bắt đầu:</strong> {new Date(season.NgayBatDau).toLocaleDateString()}</p>
            <p className={styles.paragraph}><strong>Ngày kết thúc:</strong> {new Date(season.NgayKetThuc).toLocaleDateString()}</p>
            <div className={styles.infoAndLinks}>
                <div className={styles.priorityInfo}>
                <button onClick={handleOpenEditPriorityModal} className={styles.editButton} style={{ marginLeft: '10px', fontSize: '14px' }}>
                            Sửa
                        </button>
                    <p className={styles.paragraph}>
                        <strong>Ưu tiên xếp hạng:</strong>
                    </p>
                    {priority.sort((a, b) => a.MucDoUuTien - b.MucDoUuTien).map((p, index) => (
                        <p key={p.MaLoaiUuTien} className={styles.paragraph}>
                            <strong>{index + 1}. {p.LoaiUuTien?.TenLoaiUuTien}:</strong> Mức độ {p.MucDoUuTien}
                        </p>
                    ))}
                </div>
                <div className={styles.navigationLinks}>
                    <Link to={`/mua-giai/${MaMuaGiai}/bang-xep-hang`} className={styles.link}>
                        Xem Bảng Xếp Hạng
                    </Link>
                    <Link to={`/mua-giai/${MaMuaGiai}/vua-pha-luoi`} className={styles.link}>
                        Xem Vua Phá Lưới
                    </Link>
                </div>
            </div>

            <div>
                <h3 className={styles.title} style={{ fontSize: '20px' }}>Vòng đấu:</h3>
                {rounds.length > 0 ? (
                    <ul className={styles.list}>
                        {rounds.map(round => (
                            <li key={round.MaVongDau} className={styles['list-item']}>
                                Vòng {round.TenVongDau} (
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
                <button className={styles.addbutton} onClick={handleCreateRound} disabled={isCreatingRound}>
                    {isCreatingRound ? 'Đang tạo...' : 'Tạo vòng đấu'}
                </button>
                {error && <p className={styles.error}>{error}</p>}
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
                            name="MaVongDau"
                            value={roundToEdit.MaVongDau}
                            onChange={handleEditRoundInputChange}
                            className={styles['modal-input']}
                            readOnly
                        />
                        <label htmlFor="editRoundName">Tên vòng đấu:</label>
                        <input
                            type="text"
                            id="editRoundName"
                            name="TenVongDau"
                            value={roundToEdit.TenVongDau}
                            onChange={handleEditRoundInputChange}
                            className={styles['modal-input']}
                        />
                        <label htmlFor="editRoundStartDate">Ngày bắt đầu:</label>
                        <input
                            type="date"
                            id="editRoundStartDate"
                            name="NgayBatDau"
                            value={roundToEdit.NgayBatDau}
                            onChange={handleEditRoundInputChange}
                            className={styles['modal-input']}
                        />
                        <label htmlFor="editRoundEndDate">Ngày kết thúc:</label>
                        <input
                            type="date"
                            id="editRoundEndDate"
                            name="NgayKetThuc"
                            value={roundToEdit.NgayKetThuc}
                            onChange={handleEditRoundInputChange}
                            className={styles['modal-input']}
                        />
                        <button onClick={handleSaveEditedRound} className={styles.button}>Lưu</button>
                    </div>
                </div>
            )}

            {isEditPriorityModalOpen && (
                <div className={styles.modal}>
                    <div className={styles['modal-content']}>
                        <span className={styles.close} onClick={handleCloseEditPriorityModal}>×</span>
                        <h3>Sửa ưu tiên xếp hạng</h3>
                        {editPriorityError && <p className={styles.error}>{editPriorityError}</p>}
                        <ul className={styles.list}>
                            {editedPriority.sort((a, b) => a.MaLoaiUuTien - b.MaLoaiUuTien).map((item, index) => (
                                <li key={item.MaLoaiUuTien} className={styles['modal-list-item']}>
                                    <label htmlFor={`priority-${index}`}>
                                        {item.LoaiUuTien?.TenLoaiUuTien}:
                                    </label>
                                    <input
                                        type="number"
                                        id={`priority-${index}`}
                                        value={item.MucDoUuTien}
                                        min="1"
                                        max="3"
                                        onChange={(e) => handlePriorityInputChange(index, e.target.value)}
                                        className={styles['modal-input']}
                                    />
                                </li>
                            ))}
                        </ul>
                        <button onClick={handleSavePriority} className={styles.button}>Lưu thay đổi</button>
                    </div>
                </div>
            )}

            {isAddTeamsModalOpen && (
                <div className={styles.modal}>
                    <div className={styles['modal-content']}>
                        <span className={styles.close} onClick={handleCloseAddTeamsModal}>×</span>
                        <h3>Thêm đội bóng vào mùa giải</h3>
                        {availableTeamsForSeason.length > 0 ? (
                            <div>
                                <ul className={styles.list}>
                                    {currentTeams.map(team => (
                                        <li key={team.MaDoiBong} className={styles['modal-list-item']}>
                                            <label>
                                                <input
                                                    type="checkbox"
                                                    checked={selectedTeamsToAdd.some(item => item.MaDoiBong === team.MaDoiBong)}
                                                    onChange={() => handleToggleTeamSelection(team.MaDoiBong)}
                                                />
                                                {team.TenDoiBong} ({team.MaDoiBong})
                                            </label>
                                        </li>
                                    ))}
                                </ul>
                                <div className={styles['pagination-controls']}>
                                    {pageNumbers.map(pageNumber => (
                                        <button
                                            key={pageNumber}
                                            onClick={() => handlePageClick(pageNumber)}
                                            className={currentPage === pageNumber ? styles['active-page'] : ''}
                                        >
                                            {pageNumber}
                                        </button>
                                    ))}
                                </div>
                            </div>
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
                            <li key={team.MaDoiBong} className={styles['list-item']}>
                                <Link to={`/doi-bong/${team.MaDoiBong}`} className={styles.teamLink}>
                                    {team.TenDoiBong}
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