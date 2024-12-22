import React, { useState } from 'react';
import './Modal.css';

const Modal = ({ type, player, positions, season, onSave, onCancel }) => {
  const [formData, setFormData] = useState(
    player || {
      name: '',
      position: '',
      dob: '',
      nationality: '',
      birthplace: '',
      height: '',
      weight: '',
      bio: '',
      season, // Default to the passed season
    }
  );

  const handleChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  return (
    <div className="modal">
      <div className="modal-content">
        <h3>{type === 'add' ? 'Thêm cầu thủ mới' : 'Chỉnh sửa cầu thủ'}</h3>
        <form className="modal-form">
          <div className="form-group">
            <label>Mùa giải:</label>
            <input type="text" value={formData.season} disabled className="readonly-field" />
          </div>
          <div className="form-group">
            <label>Tên cầu thủ:</label>
            <input
              type="text"
              placeholder="Tên cầu thủ"
              value={formData.name}
              onChange={(e) => handleChange('name', e.target.value)}
            />
          </div>
          <div className="form-group">
            <label>Vị trí:</label>
            <select
              value={formData.position}
              onChange={(e) => handleChange('position', e.target.value)}
            >
              <option value="" disabled>Chọn vị trí</option>
              {positions.map((position) => (
                <option key={position} value={position}>{position}</option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label>Ngày sinh:</label>
            <input
              type="date"
              value={formData.dob}
              onChange={(e) => handleChange('dob', e.target.value)}
            />
          </div>
          <div className="grid-pair">
            <div className="form-group">
              <label>Nơi sinh:</label>
              <input
                type="text"
                placeholder="Nơi sinh"
                value={formData.birthplace}
                onChange={(e) => handleChange('birthplace', e.target.value)}
              />
            </div>
            <div className="form-group">
              <label>Quốc tịch:</label>
              <input
                type="text"
                placeholder="Quốc tịch"
                value={formData.nationality}
                onChange={(e) => handleChange('nationality', e.target.value)}
              />
            </div>
          </div>
          <div className="grid-pair">
            <div className="form-group">
              <label>Chiều cao (cm):</label>
              <input
                type="number"
                placeholder="Chiều cao (cm)"
                value={formData.height}
                onChange={(e) => handleChange('height', e.target.value)}
              />
            </div>
            <div className="form-group">
              <label>Cân nặng (kg):</label>
              <input
                type="number"
                placeholder="Cân nặng (kg)"
                value={formData.weight}
                onChange={(e) => handleChange('weight', e.target.value)}
              />
            </div>
          </div>
          <div className="form-group">
            <label>Tiểu sử:</label>
            <textarea
              placeholder="Tiểu sử"
              value={formData.bio}
              onChange={(e) => handleChange('bio', e.target.value)}
            />
          </div>
          <div className="modal-actions">
            <button onClick={() => onSave(formData)} className="save-button">
              {type === 'add' ? 'Thêm' : 'Lưu'}
            </button>
            <button onClick={onCancel} className="cancel-button">Hủy</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Modal;
