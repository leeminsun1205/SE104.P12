// src/pages/CreateNew/CreateSeason.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './CreateSeason.module.css'; // Import CSS module

function CreateSeason({ API_URL }) {
    const navigate = useNavigate();
    const [season, setSeason] = useState({
        name: '',
        startDate: '',
        endDate: '',
    });
    const [errors, setErrors] = useState({
        name: '',
        startDate: '',
        endDate: '',
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
            startDate: '',
            endDate: '',
        });
        setErrors({
            name: '',
            startDate: '',
            endDate: '',
        });
        setGeneralError('');
        setSuccessMessage('');
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        let isValid = true;
        const newErrors = {};

        if (!season.name.trim()) {
            newErrors.name = 'Tên mùa giải không được để trống.';
            isValid = false;
        }
        if (!season.startDate) {
            newErrors.startDate = 'Ngày bắt đầu không được để trống.';
            isValid = false;
        }
        if (!season.endDate) {
            newErrors.endDate = 'Ngày kết thúc không được để trống.';
            isValid = false;
        } else if (season.startDate && season.endDate && season.endDate <= season.startDate) {
            newErrors.endDate = 'Ngày kết thúc phải sau ngày bắt đầu.';
            isValid = false;
        }

        setErrors(newErrors);

        if (isValid) {
            try {
                const response = await fetch(`${API_URL}/seasons`, {
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
                    navigate(`/seasons/${data.season.id}`);
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
                    <label htmlFor="name">Tên mùa giải:</label>
                    <input
                        type="text"
                        id="name"
                        name="name"
                        value={season.name}
                        onChange={handleChange}
                    />
                    {errors.name && <p className={styles['error-message']}>{errors.name}</p>}
                </div>
                <div className={styles['form-group']}>
                    <label htmlFor="startDate">Ngày bắt đầu:</label>
                    <input
                        type="date"
                        id="startDate"
                        name="startDate"
                        value={season.startDate}
                        onChange={handleChange}
                    />
                    {errors.startDate && <p className={styles['error-message']}>{errors.startDate}</p>}
                </div>
                <div className={styles['form-group']}>
                    <label htmlFor="endDate">Ngày kết thúc:</label>
                    <input
                        type="date"
                        id="endDate"
                        name="endDate"
                        value={season.endDate}
                        onChange={handleChange}
                    />
                    {errors.endDate && <p className={styles['error-message']}>{errors.endDate}</p>}
                </div>
                <div className="create-container">
                    <button type="submit" className={styles['submit-button']}>Tạo mùa giải</button>
                    <button type="button" onClick={handleCancel} className={styles['cancel-button']}>Hủy</button>
                    <button type="button" className={styles['reset-button']} onClick={handleReset}>Reset</button>
                </div>
            </form>
        </div>
    );
}

export default CreateSeason;