// /src/pages/Teams/EditTeams.js
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import './EditTeam.css';

function EditTeam({ teams, onEditTeam }) {
    const { id } = useParams();
    const navigate = useNavigate();
    const [team, setTeam] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const teamToEdit = teams.find((team) => team.id === parseInt(id));
        setTeam(teamToEdit);
        setLoading(false);
    }, [teams, id]);

    const handleSave = () => {
        if (team && team.name.trim() && team.city.trim()) {
            onEditTeam(team);
            alert('Thông tin đội bóng đã được cập nhật thành công!');
            navigate('/teams');
        } else {
            alert('Vui lòng điền đầy đủ thông tin.');
        }
    };

    if (loading) {
        return <div className="loader">Loading...</div>;
    }

    if (!team) {
        return <div>Đội bóng không tồn tại.</div>;
    }

    return (
        <div className="form-container">
            <h2>Sửa thông tin đội bóng</h2>
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
                <button className="save" onClick={handleSave}>
                    Lưu
                </button>
                <button className="cancel" onClick={() => navigate('/teams')}>
                    Hủy
                </button>
            </div>
        </div>
    );
}

export default EditTeam;
