// src/pages/Teams/CreateTeam.js
import React, { useState, memo } from 'react';
import { useNavigate } from 'react-router-dom';
import './CreateTeam.css';

const CreateTeam = memo(({ onAddTeam }) => {
    const navigate = useNavigate();
    const [team, setTeam] = useState({
        name: '',
        city: '',
        managing_body: '',
        stadium: '',
        capacity: '',
        fifa_stars: '',
        home_kit_image: null,
        away_kit_image: null,
        third_kit_image: null,
        description: '',
    });
    const [imagePreviews, setImagePreviews] = useState({
        home_kit_image: null,
        away_kit_image: null,
        third_kit_image: null,
    });
    const [error, setError] = useState('');

    const handleAdd = async () => {
        setError('');
    
        if (!team.name.trim() || !team.city.trim()) {
            setError('Vui lòng điền đầy đủ thông tin.');
            return;
        }
    
        const newTeam = {
            ...team,
            id: Date.now(), // Temporary ID, server will likely assign a proper one
            capacity: team.capacity ? parseInt(team.capacity, 10) : null,
            fifa_stars: team.fifa_stars ? parseInt(team.fifa_stars, 10) : null,
        };
    
        console.log('Creating Team:', newTeam);
    
        try {
            const response = await fetch('http://localhost:5000/api/teams/available', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newTeam),
            });
    
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to create team');
            }
    
            const data = await response.json();
            console.log("Calling onAddTeam with:", data.team)
            if (typeof onAddTeam === 'function') {
                onAddTeam(data.team);
            }
            navigate('/create');
    
        } catch (error) {
            console.error('Error creating team:', error);
            setError(error.message);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setTeam((prev) => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e) => {
        const { name, files } = e.target;
        if (files && files[0]) {
            const file = files[0];
            setTeam((prev) => ({ ...prev, [name]: file }));

            const previewUrl = URL.createObjectURL(file);
            setImagePreviews((prev) => ({ ...prev, [name]: previewUrl }));
        }
    };

    const resetForm = () => {
        setTeam({
            name: '',
            city: '',
            managing_body: '',
            stadium: '',
            capacity: '',
            fifa_stars: '',
            home_kit_image: null,
            away_kit_image: null,
            third_kit_image: null,
            description: '',
        });
        setImagePreviews({
            home_kit_image: null,
            away_kit_image: null,
            third_kit_image: null,
        });
    };

    return (
        <div className="form-container">
            <h2>Thêm đội bóng mới</h2>
            {error && <p className="error-message">{error}</p>}
            {[
                { name: 'name', label: 'Tên đội bóng', type: 'text', required: true },
                { name: 'city', label: 'Thành phố', type: 'text', required: true },
                { name: 'managing_body', label: 'Cơ quan/Công ty chủ quản', type: 'text' },
                { name: 'stadium', label: 'Địa điểm sân nhà', type: 'text' },
                { name: 'capacity', label: 'Sức chứa', type: 'number' },
                { name: 'fifa_stars', label: 'Đạt tiêu chuẩn (số sao)', type: 'number' },
            ].map((input) => (
                <div key={input.name}>
                    <label htmlFor={input.name}>
                        {input.label} {input.required && <span style={{ color: 'red' }}>*</span>}
                    </label>
                    <input
                        type={input.type}
                        name={input.name}
                        id={input.name}
                        value={team[input.name] || ''}
                        onChange={handleChange}
                        required={input.required}
                    />
                </div>
            ))}
            {[
                { name: 'home_kit_image', label: 'Quần áo sân nhà' },
                { name: 'away_kit_image', label: 'Quần áo sân khách' },
                { name: 'third_kit_image', label: 'Quần áo dự bị' },
            ].map((fileInput) => (
                <div key={fileInput.name}>
                    <label htmlFor={fileInput.name}>{fileInput.label}</label>
                    <input
                        type="file"
                        name={fileInput.name}
                        id={fileInput.name}
                        onChange={handleFileChange}
                        accept="image/*"
                    />
                    {imagePreviews[fileInput.name] && (
                        <img
                            src={imagePreviews[fileInput.name]}
                            alt={`${fileInput.label} preview`}
                            className="image-preview"
                        />
                    )}
                </div>
            ))}
            <div>
                <label htmlFor="description">Giới thiệu đội</label>
                <textarea
                    name="description"
                    id="description"
                    value={team.description || ''}
                    onChange={handleChange}
                />
            </div>
            <div className="create-container">
                <button className="add" onClick={handleAdd}>
                    Thêm
                </button>
                <button className="cancel" onClick={() => navigate('/create')}>
                    Hủy
                </button>
                <button className="reset" onClick={resetForm}>
                    Xóa
                </button>
            </div>
        </div>
    );
});

export default CreateTeam;