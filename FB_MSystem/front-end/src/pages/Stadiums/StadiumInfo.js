import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styles from './StadiumInfo.module.css';
import EditStadiumModal from './EditStadiumModal';

function StadiumInfo() {
  const { MaSan } = useParams();
  const navigate = useNavigate();
  const [stadium, setStadium] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedStadium, setEditedStadium] = useState({});
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const fetchStadiumData = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`http://localhost:5000/san-thi-dau/${MaSan}`);
        if (!response.ok) {
          throw new Error('Failed to fetch stadium data');
        }
        const data = await response.json();
        setStadium(data);
        setEditedStadium(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStadiumData();
  }, [MaSan]);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setEditedStadium({ ...editedStadium, [name]: value });
  };

  const handleEdit = () => {
    setIsEditing(true);
    setShowModal(true);
  };

  const handleSave = async () => {
    setIsLoading(true);
    try {
        const response = await fetch(`http://localhost:5000/san-thi-dau/${MaSan}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(editedStadium),
        });

        if (!response.ok) {
            throw new Error('Failed to update stadium data');
        }

        const refetchResponse = await fetch(`http://localhost:5000/san-thi-dau/${MaSan}`);
        if (!refetchResponse.ok) {
            throw new Error('Failed to refetch stadium data');
        }
        const updatedStadium = await refetchResponse.json();

        setStadium(updatedStadium);
        setIsEditing(false);
        setShowModal(false);
    } catch (error) {
        setError(error.message);
    } finally {
        setIsLoading(false);
    }
};
  const handleCancel = () => {
    setIsEditing(false);
    setEditedStadium(stadium);
    setShowModal(false);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setIsEditing(false);
    setEditedStadium(stadium);
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!stadium) {
    return <div>Stadium not found.</div>;
  }

  return (
    <div className={styles['stadium-info']}>
      <button className={styles['go-back-button']} onClick={() => navigate(-1)}>
        Quay lại
      </button>
      <h2>Thông tin sân vận động {stadium.TenSan}</h2>

      <div className={styles['stadium-details']}>
        <ul>
          <li>
            <strong>Địa chỉ:</strong> {stadium.DiaChiSan}
          </li>
          <li>
            <strong>Sức chứa:</strong> {stadium.SucChua}
          </li>
          <li>
            <strong>Tiêu chuẩn:</strong> {stadium.TieuChuan} sao
          </li>
        </ul>
        <button className={styles['edit-button']} onClick={handleEdit}>
          Sửa thông tin
        </button>
      </div>

      <EditStadiumModal show={showModal} onHide={handleCloseModal}>
        {isEditing && (
          <div className={styles['stadium-edit-form']}>
            <h3>Sửa thông tin sân vận động {stadium.TenSan}</h3>
            <label htmlFor="address">Địa chỉ:</label>
            <input
              type="text"
              id="DiaChiSan"
              name="DiaChiSan"
              value={editedStadium.DiaChiSan}
              onChange={handleInputChange}
            />

            <label htmlFor="capacity">Sức chứa:</label>
            <input
              type="number"
              id="SucChua"
              name="SucChua"
              value={editedStadium.SucChua}
              onChange={handleInputChange}
            />

            <label htmlFor="standard">Tiêu chuẩn (sao):</label>
            <input
              type="number"
              id="TieuChuan"
              name="TieuChuan"
              min="1"
              max="5"
              value={editedStadium.TieuChuan}
              onChange={handleInputChange}
            />

            <button
              className={styles['save-button']}
              onClick={handleSave}
              disabled={isLoading}
            >
              Lưu
            </button>
            <button className={styles['cancel-button']} onClick={handleCancel}>
              Hủy
            </button>
          </div>
        )}
      </EditStadiumModal>
    </div>
  );
}

export default StadiumInfo;