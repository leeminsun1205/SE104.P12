import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './OtherLeagueMatches.css';

function OtherLeagueMatches() {
    const navigate = useNavigate();
    const initialMatches = [
        { id: 1, league_name: 'League X', match_date: '2023-12-25' },
        { id: 2, league_name: 'League Y', match_date: '2024-01-15' },
        { id: 3, league_name: 'League Z', match_date: '2024-02-20' },
        { id: 4, league_name: 'League X', match_date: '2024-03-10' },
    ];

    const [matches, setMatches] = useState(initialMatches);
    const [sortConfig, setSortConfig] = useState({ key: null, direction: null });
    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [matchToEdit, setMatchToEdit] = useState(null);
    const [matchToDelete, setMatchToDelete] = useState(null);
    const [newMatch, setNewMatch] = useState({ league_name: '', match_date: '' });

    // Sorting function
    const sortMatches = (key) => {
        const direction = sortConfig.key === key && sortConfig.direction === 'asc' ? 'desc' : 'asc';
        const sortedMatches = [...matches].sort((a, b) => {
            if (a[key] < b[key]) return direction === 'asc' ? -1 : 1;
            if (a[key] > b[key]) return direction === 'asc' ? 1 : -1;
            return 0;
        });
        setSortConfig({ key, direction });
        setMatches(sortedMatches);
    };

    const handleNavigate = () => {
        navigate(-1);
    };

    const handleOpenAddModal = () => {
        setShowAddModal(true);
        setNewMatch({ league_name: '', match_date: '' }); // Reset new match data
    };

    const handleCloseAddModal = () => {
        setShowAddModal(false);
    };

    const handleAddMatch = () => {
        const nextId = matches.length > 0 ? Math.max(...matches.map(match => match.id)) + 1 : 1;
        setMatches([...matches, { ...newMatch, id: nextId }]);
        handleCloseAddModal();
    };

    const handleOpenEditModal = (match) => {
        setMatchToEdit(match);
        setShowEditModal(true);
    };

    const handleCloseEditModal = () => {
        setShowEditModal(false);
        setMatchToEdit(null);
    };

    const handleEditMatch = (updatedMatch) => {
        const updatedMatches = matches.map(match =>
            match.id === updatedMatch.id ? updatedMatch : match
        );
        setMatches(updatedMatches);
        handleCloseEditModal();
    };

    const handleOpenDeleteModal = (match) => {
        setMatchToDelete(match);
        setShowDeleteModal(true);
    };

    const handleCloseDeleteModal = () => {
        setShowDeleteModal(false);
        setMatchToDelete(null);
    };

    const handleDeleteMatch = () => {
        const updatedMatches = matches.filter(match => match.id !== matchToDelete.id);
        setMatches(updatedMatches);
        handleCloseDeleteModal();
    };

    const handleInputChange = (e, key) => {
        setNewMatch({ ...newMatch, [key]: e.target.value });
    };

    const handleEditInputChange = (e, key) => {
        setMatchToEdit({ ...matchToEdit, [key]: e.target.value });
    };

    return (
        <div className="team-matches">
            <button className="go-back-button" onClick={handleNavigate}>
                Quay lại
            </button>
            <h2>Lịch thi đấu giải đấu khác</h2>

            <button className="add-button" onClick={handleOpenAddModal}>
                Thêm trận đấu
            </button>

            <table>
                <thead>
                    <tr>
                        <th
                            className="table-header-cell"
                            onClick={() => sortMatches('league_name')}
                            style={{ cursor: 'pointer' }}
                        >
                            Giải đấu{sortConfig.key === 'league_name' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                        </th>
                        <th
                            className="table-header-cell"
                            onClick={() => sortMatches('match_date')}
                            style={{ cursor: 'pointer' }}
                        >
                            Lịch thi đấu {sortConfig.key === 'match_date' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                        </th>
                        <th className="table-header-cell">Hành động</th>
                    </tr>
                </thead>
                <tbody>
                    {matches.map((match) => (
                        <tr key={match.id}>
                            <td className="table-cell">{match.league_name}</td>
                            <td className="table-cell">{match.match_date}</td>
                            <td className="table-cell">
                                <button className="edit-button" onClick={() => handleOpenEditModal(match)}>Sửa</button>
                                <button className="delete-button" onClick={() => handleOpenDeleteModal(match)}>Xóa</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {showAddModal && (
                <div className="modal">
                    <div className="modal-content">
                        <span className="close-button" onClick={handleCloseAddModal}>×</span>
                        <h3>Thêm trận đấu</h3>
                        <div className="form-group">
                            <label>Giải đấu:</label>
                            <input type="text" value={newMatch.league_name} onChange={(e) => handleInputChange(e, 'league_name')} />
                        </div>
                        <div className="form-group">
                            <label>Lịch thi đấu:</label>
                            <input type="date" value={newMatch.match_date} onChange={(e) => handleInputChange(e, 'match_date')} />
                        </div>
                        <button className="submit-button" onClick={handleAddMatch}>Thêm</button>
                    </div>
                </div>
            )}

            {showEditModal && matchToEdit && (
                <div className="modal">
                    <div className="modal-content">
                        <span className="close-button" onClick={handleCloseEditModal}>×</span>
                        <h3>Sửa trận đấu</h3>
                        <div className="form-group">
                            <label>Giải đấu:</label>
                            <input type="text" value={matchToEdit.league_name} onChange={(e) => handleEditInputChange(e, 'league_name')} />
                        </div>
                        <div className="form-group">
                            <label>Lịch thi đấu:</label>
                            <input type="date" value={matchToEdit.match_date} onChange={(e) => handleEditInputChange(e, 'match_date')} />
                        </div>
                        <button className="submit-button" onClick={() => handleEditMatch(matchToEdit)}>Lưu</button>
                    </div>
                </div>
            )}

            {/* Delete Modal */}
            {showDeleteModal && matchToDelete && (
                <div className="modal">
                    <div className="modal-content">
                        <span className="close-button" onClick={handleCloseDeleteModal}>×</span>
                        <h3>Xóa trận đấu</h3>
                        <p>Bạn có chắc chắn muốn xóa trận đấu <strong>{matchToDelete.league_name}</strong> vào ngày <strong>{matchToDelete.match_date}</strong> không?</p>
                        <div className="modal-actions">
                            <button className="delete-confirm-button" onClick={handleDeleteMatch}>Xóa</button>
                            <button className="cancel-button" onClick={handleCloseDeleteModal}>Hủy</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default OtherLeagueMatches;