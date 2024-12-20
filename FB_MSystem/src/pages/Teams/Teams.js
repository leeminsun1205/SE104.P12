import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import SeasonSelector from '../../components/SeasonSelector/SeasonSelector';
import './Teams.css'; // Make sure this CSS file exists

function Teams({ teams, seasons, onDeleteTeam }) { // Removed onAddTeam and onEditTeam from props here
    const navigate = useNavigate();
    const [selectedSeason, setSelectedSeason] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredTeams, setFilteredTeams] = useState([]);

    useEffect(() => {
        if (seasons && seasons.length > 0) {
            if (!selectedSeason) {
                setSelectedSeason(seasons[0]);
            }
            setFilteredTeams(teams.filter(
                (team) =>
                    team.season === selectedSeason &&
                    team.name.toLowerCase().includes(searchTerm.toLowerCase())
            ));
        } else {
            setFilteredTeams([]);
        }
    }, [teams, selectedSeason, searchTerm, seasons]);

    const handleDelete = (id) => {
        const confirmDelete = window.confirm('Bạn có chắc chắn muốn xóa đội bóng này?');
        if (confirmDelete) {
            onDeleteTeam(id);
        }
    };

    const handleEdit = (id) => {
        navigate(`/teams/edit/${id}`);
    };

    const handleAddTeam = () => {
        navigate('/teams/add');
    };

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
            <input
                type="text"
                placeholder="Tìm kiếm đội bóng..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button className="add-button" onClick={handleAddTeam}>
                Thêm đội bóng mới
            </button>
            <ul>
                {filteredTeams.length > 0 ? (
                    filteredTeams.map((team) => (
                        <li key={team.id}>
                            <h3>{team.name}</h3>
                            <p>Thành phố: {team.city}</p>
                            <div className="actions">
                                <button className="edit" onClick={() => handleEdit(team.id)}>
                                    Sửa
                                </button>
                                <button className="delete" onClick={() => handleDelete(team.id)}>
                                    Xóa
                                </button>
                            </div>
                        </li>
                    ))
                ) : (
                    <p>Không tìm thấy đội bóng nào.</p>
                )}
            </ul>
        </div>
    );
}

export default Teams;