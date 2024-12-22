// src/pages/Teams/EditTeam.js
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import './EditTeam.css';

const API_URL = 'http://localhost:5000/api';

function EditTeam() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [team, setTeam] = useState(null);
    const [imagePreviews, setImagePreviews] = useState({
        home_kit_image: null,
        away_kit_image: null,
        third_kit_image: null,
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchTeam = async () => {
          try {
            const response = await fetch(`${API_URL}/teams/${id}`);
            if (!response.ok) {
              throw new Error('Failed to fetch team data');
            }
            const data = await response.json();
            setTeam(data);
            setImagePreviews({
              home_kit_image: data.home_kit_image,
              away_kit_image: data.away_kit_image,
              third_kit_image: data.third_kit_image,
            });
          } catch (error) {
            console.error('Error fetching team:', error);
            setError(error.message);
          } finally {
            setLoading(false);
          }
        };
      
        fetchTeam();
      }, [id]);

      const handleSave = async () => {
        setError('');
        if (!team || !team.name.trim() || !team.city.trim()) {
          setError('Please fill in all required fields.');
          return;
        }
      
        const updatedTeam = {
          ...team,
          capacity: team.capacity ? parseInt(team.capacity, 10) : null,
          fifa_stars: team.fifa_stars ? parseInt(team.fifa_stars, 10) : null,
        };
      
        const formData = new FormData();
        for (const key in updatedTeam) {
            if (updatedTeam[key] !== null && updatedTeam[key] !== undefined) {
              if (key === 'home_kit_image' || key === 'away_kit_image' || key === 'third_kit_image') {
                if (updatedTeam[key] instanceof File) {
                  formData.append(key, updatedTeam[key]);
                }
              } else {
                formData.append(key, updatedTeam[key]);
              }
            }
          }

        try {
          const response = await fetch(`${API_URL}/teams/${id}`, {
            method: 'PUT',
            body: formData,
          });
      
          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Failed to update team');
          }
      
          navigate('/teams');
        } catch (error) {
          console.error('Error updating team:', error);
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
            setTeam((prev) => ({ ...prev, [name]: files[0] }));
            const reader = new FileReader();
            reader.onload = () => {
                setImagePreviews((prev) => ({ ...prev, [name]: reader.result }));
            };
            reader.readAsDataURL(files[0]);
        }
    };

    if (loading) return <div className="loader">Đang tải...</div>;

    if (!team) return <div>Đội bóng không tồn tại.</div>;

    return (
        <div className="form-container">
            <h2>Sửa thông tin đội bóng</h2>
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
                    <label>{fileInput.label}</label>
                    <input
                        type="file"
                        name={fileInput.name}
                        onChange={handleFileChange}
                        accept="image/*"
                        aria-label={fileInput.label}
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
            <textarea
                name="description"
                placeholder="Giới thiệu đội"
                value={team.description || ''}
                onChange={handleChange}
                aria-label="Giới thiệu đội"
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