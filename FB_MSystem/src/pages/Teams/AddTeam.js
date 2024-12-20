// src/pages/Teams/AddTeam.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SeasonSelector from '../../components/SeasonSelector/SeasonSelector'; 
import './AddTeam.css';

function AddTeam({ teams, onAddTeam, seasons }) {
    const navigate = useNavigate();
    const [team, setTeam] = useState({ name: '', city: '' });
    const [selectedSeason, setSelectedSeason] = useState(seasons.length > 0 ? seasons[0] : ''); // Initialize selectedSeason

    const handleAdd = () => {
        if (team.name && team.city && selectedSeason) {
            const newTeam = { ...team, id: Date.now(), season: selectedSeason };
            onAddTeam(newTeam);
            navigate('/teams');
        } else {
            alert("Please fill in all fields and select a season.");
        }
    };

    return (
        <div className="form-container">
            <h2>Thêm đội bóng mới</h2>
            <SeasonSelector // Add SeasonSelector component
                seasons={seasons}
                selectedSeason={selectedSeason}
                onSeasonChange={setSelectedSeason}
            />
            <input
                type="text"
                placeholder="Tên đội bóng"
                value={team.name}
                onChange={(e) => setTeam({ ...team, name: e.target.value })}
            />
            <input
                type="text"
                placeholder="Thành phố"
                value={team.city}
                onChange={(e) => setTeam({ ...team, city: e.target.value })}
            />
            <div>
                <button className="add" onClick={handleAdd}>Thêm</button>
                <button className="cancel" onClick={() => navigate('/teams')}>Hủy</button>
            </div>
        </div>
    );
}

export default AddTeam;