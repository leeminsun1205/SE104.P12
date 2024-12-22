// /src/pages/Teams/Teams.js

import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import SeasonSelector from '../../components/SeasonSelector/SeasonSelector';
import './Teams.css';

function Teams({ teams, seasons, onDeleteTeam }) {
    const navigate = useNavigate();
    const [selectedSeason, setSelectedSeason] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredTeams, setFilteredTeams] = useState([]);

    useEffect(() => {
        if (seasons && seasons.length > 0) {
            if (!selectedSeason) {
                setSelectedSeason(seasons[0]); // Default to the first season
            }
            const term = searchTerm.trim().toLowerCase();
            setFilteredTeams(
                teams.filter(
                    (team) =>
                        team.season === selectedSeason &&
                        team.name.toLowerCase().includes(term)
                )
            );
        }
    }, [teams, selectedSeason, searchTerm, seasons]);

    const handleDelete = (id) => {
        const confirmDelete = window.confirm('Bạn có chắc chắn muốn xóa đội bóng này?');
        if (confirmDelete) {
            onDeleteTeam(id);
        }
    };
    const handleToPlayer = (id) => {
        navigate(`/teams/${id}/players`)
    };
    const handleEdit = (id) => {
        navigate(`/teams/edit/${id}`);
    };

    const handleAddTeam = () => {
        navigate('/teams/add');
    };

    const clearSearch = () => setSearchTerm('');

    if (!seasons || seasons.length === 0) {
        return <p>No seasons available.</p>;
    }

    return (
        <div className="teams">
            <h2>Danh sách đội bóng</h2>
            <SeasonSelector
                onSeasonChange={setSelectedSeason}
                seasons={seasons}
                selectedSeason={selectedSeason}
            />
            <div className="search-container">
                <div className="search-input-wrapper">
                    <input
                        type="text"
                        placeholder="Tìm kiếm đội bóng..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    {searchTerm && (
                        <button className="clear-search" onClick={clearSearch}>
                            &#x2715;
                        </button>
                    )}
                </div>
            </div>

            <button className="add-button" onClick={handleAddTeam}>
                Thêm đội bóng mới
            </button>
            {filteredTeams.length > 0 ? (
                <ul>
                    {filteredTeams.map((team) => (
                        <li key={team.id}>
                            <h3>
                                <Link to={`/teams/${team.id}`}>{team.name}</Link>
                            </h3>
                            <p>Thành phố: {team.city}</p>
                            <div className="actions">
                                <button className="toplayer" onClick={() => handleToPlayer(team.id)}>
                                    Quản lý
                                </button>
                                <button className="edit" onClick={() => handleEdit(team.id)}>
                                    Sửa
                                </button>
                                <button className="delete" onClick={() => handleDelete(team.id)}>
                                    Xóa
                                </button>
                            </div>
                        </li>
                    ))}
                </ul>
            ) : (
            <div className="empty-state">
                <p>Không tìm thấy đội bóng nào. Hãy thử tìm kiếm với từ khóa khác.</p>
            </div>
            )}
        </div>
    );
}

export default Teams;
