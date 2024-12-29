// src/pages/CreateNew/CreateSeason.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './CreateSeason.module.css'; // Import CSS module

function CreateSeason({ API_URL }) {
    const navigate = useNavigate();
    const [season, setSeason] = useState({
        TenMuaGiai: '',
        NgayBatDau: '',
        NgayKetThuc: '',
    });
    const [errors, setErrors] = useState({
        TenMuaGiai: '',
        NgayBatDau: '',
        NgayKetThuc: '',
    });
    const [generalError, setGeneralError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setSeason(prevState => ({
            ...prevState,
            [name]: value,
        }));
        setErrors(prevState => ({ ...prevState, [name]: '' }));
        setGeneralError('');
        setSuccessMessage('');
    };

    const handleCancel = () => {
        navigate(-1);
    };

    const handleReset = () => {
        setSeason({
            name: '',
            NgayBatDau: '',
            NgayKetThuc: '',
        });
        setErrors({
            name: '',
            NgayBatDau: '',
            NgayKetThuc: '',
        });
        setGeneralError('');
        setSuccessMessage('');
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        let isValid = true;
        const newErrors = {};
        if (!season.TenMuaGiai.trim()) {
            newErrors.name = 'Tên mùa giải không được để trống.';
            isValid = false;
        }
        if (!season.NgayBatDau) {
            newErrors.NgayBatDau = 'Ngày bắt đầu không được để trống.';
            isValid = false;
        }
        if (!season.NgayKetThuc) {
            newErrors.NgayKetThuc = 'Ngày kết thúc không được để trống.';
            isValid = false;
        } else if (season.NgayBatDau && season.NgayKetThuc && season.NgayKetThuc <= season.NgayBatDau) {
            newErrors.NgayKetThuc = 'Ngày kết thúc phải sau ngày bắt đầu.';
            isValid = false;
        }
        
        setErrors(newErrors);

        if (isValid) {
            try {
                const response = await fetch(`${API_URL}/mua-giai`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(season),
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.message || 'Failed to create season');
                }

                const data = await response.json();
                setSuccessMessage('Mùa giải đã được tạo thành công!');
                setTimeout(() => {
                    navigate(`/mua-giai`);
                }, 1500);
            } catch (error) {
                console.error('Error creating season:', error);
                setGeneralError(error.message);
            }
        }
    };

    return (
        <div className={styles['create-season-container']}>
            <h2>Thêm Mùa Giải Mới</h2>
            {successMessage && <p className={styles['success-message']}>{successMessage}</p>}
            {generalError && <p className={styles['error-message']}>{generalError}</p>}
            <form onSubmit={handleSubmit} className={styles['create-season-form']}>
                <div className={styles['form-group']}>
                    <label htmlFor="name">Tên mùa giải<strong><span style={{ color: 'red', marginLeft: '4px' }}>*</span></strong></label>
                    <input
                        type="text"
                        id="TenMuaGiai"
                        name="TenMuaGiai"
                        value={season.TenMuaGiai}
                        onChange={handleChange}
                    />
                    {errors.name && <p className={styles['error-message']}>{errors.name}</p>}
                </div>
                <div className={styles['form-group']}>
                    <label htmlFor="startDate">Ngày bắt đầu<strong><span style={{ color: 'red', marginLeft: '4px' }}>*</span></strong></label>
                    <input
                        type="date"
                        id="NgayBatDau"
                        name="NgayBatDau"
                        value={season.NgayBatDau}
                        onChange={handleChange}
                    />
                    {errors.NgayBatDau && <p className={styles['error-message']}>{errors.NgayBatDau}</p>}
                </div>
                <div className={styles['form-group']}>
                    <label htmlFor="endDate">Ngày kết thúc<strong><span style={{ color: 'red', marginLeft: '4px' }}>*</span></strong></label>
                    <input
                        type="date"
                        id="NgayKetThuc"
                        name="NgayKetThuc"
                        value={season.NgayKetThuc}
                        onChange={handleChange}
                    />
                    {errors.NgayKetThuc && <p className={styles['error-message']}>{errors.NgayKetThuc}</p>}
                </div>
                <div className={styles["create-container"]}>
                    <button className={styles['submit-button']} type="submit" >Tạo mùa giải</button>
                    <button type="button" onClick={handleCancel} className={styles['cancel-button']}>Hủy</button>
                    <button className={styles['reset-button']} type="button" onClick={handleReset}>Reset</button>
                </div>
            </form>
        </div>
    );
}

export default CreateSeason;