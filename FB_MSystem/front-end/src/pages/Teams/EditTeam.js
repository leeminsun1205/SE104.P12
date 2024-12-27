import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import './EditTeam.css';

const API_URL = 'http://localhost:5000/api';

function EditTeam({ onEditTeam }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [team, setTeam] = useState({
    name: '',
    city: '',
    coach: '',
    stadiumId: null,
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
  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState({}); // Use an object to store errors for each field
  const [successMessage, setSuccessMessage] = useState('');
  const [availableStadiums, setAvailableStadiums] = useState([]);

  useEffect(() => {
    const fetchTeam = async () => {
      try {
        const response = await fetch(`${API_URL}/doi-bong/${id}`);
        if (!response.ok) {
          throw new Error('Failed to fetch team data');
        }
        const data = await response.json();
        setTeam({
          name: data.name || '',
          city: data.city || '',
          coach: data.coach || '',
          stadiumId: data.stadiumId || null,
          home_kit_image: data.home_kit_image || null,
          away_kit_image: data.away_kit_image || null,
          third_kit_image: data.third_kit_image || null,
          description: data.description || '',
        });
        setImagePreviews({
          home_kit_image: data.home_kit_image,
          away_kit_image: data.away_kit_image,
          third_kit_image: data.third_kit_image,
        });
      } catch (error) {
        console.error('Error fetching team:', error);
        setErrors({ general: error.message });
      } finally {
        setLoading(false);
      }
    };

    const fetchStadiums = async () => {
      try {
        const response = await fetch(`${API_URL}/san-thi-dau`);
        if (!response.ok) {
          throw new Error('Failed to fetch stadiums');
        }
        const data = await response.json();
        setAvailableStadiums(data);
      } catch (error) {
        console.error('Error fetching stadiums:', error);
        setErrors({ general: 'Failed to fetch stadiums' });
      }
    };

    fetchTeam();
    fetchStadiums();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTeam((prev) => ({ ...prev, [name]: value }));
    setErrors((prevErrors) => ({ ...prevErrors, [name]: '' })); // Clear error on change
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

  const handleStadiumChange = (e) => {
    const selectedStadiumId = parseInt(e.target.value, 10);
    setTeam((prev) => ({
      ...prev,
      stadiumId: selectedStadiumId,
    }));
    setErrors((prevErrors) => ({ ...prevErrors, stadiumId: '' }));
  };

  const handleSave = async () => {
    setLoading(true);
    setErrors({}); // Clear previous errors
    setSuccessMessage('');

    let isValid = true;
    const newErrors = {};

    if (!team.name.trim()) {
      newErrors.name = 'Tên đội bóng không được để trống.';
      isValid = false;
    }
    if (!team.city.trim()) {
      newErrors.city = 'Thành phố không được để trống.';
      isValid = false;
    }
    if (!team.stadiumId) {
      newErrors.stadiumId = 'Sân vận động không được để trống.';
      isValid = false;
    }

    setErrors(newErrors);

    if (!isValid) {
      setLoading(false);
      return;
    }

    const updatedTeam = {
      ...team,
    };

    const formData = new FormData();
    for (const key in updatedTeam) {
      formData.append(key, updatedTeam[key]);
    }

    try {
      const response = await fetch(`${API_URL}/doi-bong/${id}`, {
        method: 'PUT',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update team');
      }

      const updatedTeamData = await response.json();
      console.log("Updated Team Data from Server:", updatedTeamData);

      setTeam({
        ...updatedTeamData.team,
      });

      onEditTeam(updatedTeamData.team);

      setSuccessMessage('Đội bóng đã được cập nhật thành công!');
      setTimeout(() => {
        setSuccessMessage('');
        navigate('/teams');
      }, 1000);
    } catch (error) {
      console.error("Error updating team:", error);
      setErrors({ general: error.message });
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="loader">Đang tải...</div>;
  if (errors.general) return <div>Error: {errors.general}</div>;
  if (!team) return <div>Đội bóng không tồn tại.</div>;

  return (
    <div className="team-form-container">
      <h2>Sửa thông tin đội bóng</h2>
      {successMessage && <p className="success-message">{successMessage}</p>}

      {/* Text Inputs */}
      <div>
        <label htmlFor="name">
          Tên đội bóng <span style={{ color: 'red' }}>*</span>
        </label>
        <input
          type="text"
          name="TenDoiBong"
          id="TenDoiBong"
          value={team.TenDoiBong || ''}
          onChange={handleChange}
        />
        {errors.TenDoiBong && <p className="error-message">{errors.TenDoiBong}</p>}
      </div>
      <div>
        <label htmlFor="city">
          Thành phố <span style={{ color: 'red' }}>*</span>
        </label>
        <input
          type="text"
          name="ThanhPhoTrucThuoc"
          id="ThanhPhoTrucThuoc"
          value={team.ThanhPhoTrucThuoc || ''}
          onChange={handleChange}
        />
        {errors.ThanhPhoTrucThuoc && <p className="error-message">{errors.ThanhPhoTrucThuoc}</p>}
      </div>
      <div>
        <label htmlFor="coach">Huấn luyện viên</label>
        <input
          type="text"
          name="TenHLV"
          id="TenHLV"
          value={team.TenHLV || ''}
          onChange={handleChange}
        />
      </div>

      <div>
        <label htmlFor="stadium">
          Địa điểm sân nhà <span style={{ color: 'red' }}>*</span>
        </label>
        <select
          name="MaSan"
          id="MaSan"
          value={team.MaSan || ''}
          onChange={handleStadiumChange}
        >
          <option value="">Chọn sân vận động</option>
          {availableStadiums.map((stadium) => (
            <option key={stadium.MaSan} value={stadium.MaSan}>
              {stadium.TenSan}
            </option>
          ))}
        </select>
        {errors.MaSan && <p className="error-message">{errors.MaSan}</p>}
      </div>

      {/* Image Uploads */}
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
      <div>
        <label htmlFor="description">Giới thiệu đội</label>
        <textarea
          name="description"
          id="description"
          value={team.description || ''}
          onChange={handleChange}
          aria-label="Giới thiệu đội"
        />
      </div>

      <div>
        <button className="save" onClick={handleSave} disabled={loading}>
          {loading ? 'Đang lưu...' : 'Lưu'}
        </button>
        <button className="cancel" onClick={() => navigate('/teams')}>
          Hủy
        </button>
      </div>
    </div>
  );
}

export default EditTeam;