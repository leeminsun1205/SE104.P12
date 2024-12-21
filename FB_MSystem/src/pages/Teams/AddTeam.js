import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './AddTeam.css';

function AddTeam({ teams = [], onAddTeam, seasons }) {
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
    const [selectedSeason, setSelectedSeason] = useState(seasons[0] || '');
    const [error, setError] = useState('');

    const handleAdd = () => {
        setError('');

        if (!team.name.trim() || !team.city.trim() || !selectedSeason) {
            setError('Vui lòng điền đầy đủ thông tin và chọn một mùa giải.');
            return;
        }

        const duplicateTeam = teams.find(
            (existingTeam) => existingTeam?.name?.toLowerCase() === team.name.toLowerCase()
        );
        if (duplicateTeam) {
            setError('Tên đội bóng đã tồn tại.');
            return;
        }

        const newTeam = {
            ...team,
            id: Date.now(),
            season: selectedSeason,
            capacity: team.capacity ? parseInt(team.capacity, 10) : null,
            fifa_stars: team.fifa_stars ? parseInt(team.fifa_stars, 10) : null,
        };

        console.log('Adding Team:', newTeam);

        if (typeof onAddTeam === 'function') {
            onAddTeam(newTeam);
        } else {
            console.error('onAddTeam is not defined or is not a function');
        }

        navigate('/teams');
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
        setSelectedSeason(seasons[0] || '');
    };

    return (
        <div className="form-container">
            <h2>Thêm đội bóng mới</h2>
            {error && <p className="error-message">{error}</p>}
            <div>
                <label htmlFor="season">Mùa giải</label> {/* Added htmlFor */}
                <select
                    id="season" // Added id
                    value={selectedSeason}
                    onChange={(e) => setSelectedSeason(e.target.value)}
                >
                    {seasons.map((season) => (
                        <option key={season} value={season}>
                            {season}
                        </option>
                    ))}
                </select>
            </div>
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
            <div>
                <button className="add" onClick={handleAdd}>
                    Thêm
                </button>
                <button className="cancel" onClick={() => navigate('/teams')}>
                    Hủy
                </button>
                <button className="reset" onClick={resetForm}>
                    Xóa
                </button>
            </div>
        </div>
    );
}

export default AddTeam;