// src/pages/Stadiums/CreateStadium.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './CreateStadium.module.css'; 

function CreateStadium({ API_URL, onAddStadium }) {
    const [stadium, setStadium] = useState({
        stadiumName: '',
        address: '',
        capacity: '',
        standard: '',
    });

    const navigate = useNavigate();
    const [errors, setErrors] = useState({
        stadiumName: '',
        address: '',
        capacity: '',
        standard: '',
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setStadium(prevState => ({
            ...prevState,   
            [name]: value,
        }));
        setErrors(prevState => ({ ...prevState, [name]: '' }));
    };

    const handleCancel = () => {
        navigate(-1);
    };

    const handleReset = () => {
        setStadium({
            stadiumName: '',
            address: '',
            capacity: '',
            standard: '',
        });
        setErrors({
            stadiumName: '',
            address: '',
            capacity: '',
            standard: '',
        });
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        let isValid = true;
        const newErrors = {};

        if (!stadium.stadiumName.trim()) {
            newErrors.stadiumName = 'Tên sân không được để trống.';
            isValid = false;
        }
        if (!stadium.address.trim()) {
            newErrors.address = 'Địa chỉ không được để trống.';
            isValid = false;
        }
        if (!stadium.capacity) {
            newErrors.capacity = 'Sức chứa không được để trống.';
            isValid = false;
        } else if (isNaN(stadium.capacity) || parseInt(stadium.capacity) <= 0) {
            newErrors.capacity = 'Sức chứa phải là một số lớn hơn 0.';
            isValid = false;
        }
        if (!stadium.standard) {
            newErrors.standard = 'Tiêu chuẩn không được để trống.';
            isValid = false;
        } else if (isNaN(stadium.standard) || parseInt(stadium.standard) < 1 || parseInt(stadium.standard) > 5) {
            newErrors.standard = 'Tiêu chuẩn phải là một số từ 1 đến 5.';
            isValid = false;
        }

        setErrors(newErrors);

        if (isValid) {
            const newStadium = {
                ...stadium,
                capacity: parseInt(stadium.capacity, 10),
                standard: parseInt(stadium.standard, 10),
            };

            try {
                const response = await fetch(`${API_URL}/san-thi-dau`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(newStadium),
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.message || 'Failed to create stadium');
                }

                const data = await response.json();
                if (typeof onAddStadium === 'function') {
                    onAddStadium(data.stadium);
                }
                navigate('/stadiums');
            } catch (error) {
                console.error('Error creating stadium:', error);
                // You might want to set a general error message here if the API call fails
                // setErrors({ general: error.message });
            }
        }
    };

    return (
        <div className={styles['create-stadium-container']}>
            <h2>Thêm sân vận động mới</h2>
            <form onSubmit={handleSubmit} className={styles['create-stadium-form']}>
                <div className={styles['form-group']}>
                    <label htmlFor="stadiumName">Tên sân:</label>
                    <input
                        type="text"
                        id="stadiumName"
                        name="stadiumName"
                        value={stadium.stadiumName}
                        onChange={handleChange}
                    />
                    {errors.stadiumName && <p className={styles['error-message']}>{errors.stadiumName}</p>}
                </div>
                <div className={styles['form-group']}>
                    <label htmlFor="address">Địa chỉ:</label>
                    <input
                        type="text"
                        id="address"
                        name="address"
                        value={stadium.address}
                        onChange={handleChange}
                    />
                    {errors.address && <p className={styles['error-message']}>{errors.address}</p>}
                </div>
                <div className={styles['form-group']}>
                    <label htmlFor="capacity">Sức chứa:</label>
                    <input
                        type="number"
                        id="capacity"
                        name="capacity"
                        value={stadium.capacity}
                        onChange={handleChange}
                    />
                    {errors.capacity && <p className={styles['error-message']}>{errors.capacity}</p>}
                </div>
                <div className={styles['form-group']}>
                    <label htmlFor="standard">Tiêu chuẩn (1-5 sao):</label>
                    <input
                        type="number"
                        id="standard"
                        name="standard"
                        value={stadium.standard}
                        onChange={handleChange}
                    />
                    {errors.standard && <p className={styles['error-message']}>{errors.standard}</p>}
                </div>
                <div className={styles["create-container"]}>
                    <button type="submit" className={styles['submit-button']}>Thêm sân vận động</button>
                    <button type="button" onClick={handleCancel} className={styles['cancel-button']}>Hủy</button>
                    <button type="button" className={styles['reset-button']} onClick={handleReset}>Reset</button>
                </div>
            </form>
        </div>
    );
}

export default CreateStadium;