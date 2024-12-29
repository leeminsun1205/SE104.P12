// src/pages/Stadiums/CreateStadium.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './CreateStadium.module.css';

function CreateStadium({ API_URL, onAddStadium }) {
    const [stadium, setStadium] = useState({
        TenSan: '',
        DiaChiSan: '',
        SucChua: '',
        TieuChuan: '',
    });

    const navigate = useNavigate();
    const [errors, setErrors] = useState({
        TenSan: '',
        DiaChiSan: '',
        SucChua: '',
        TieuChuan: '',
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
            TenSan: '',
            DiaChiSan: '',
            SucChua: '',
            TieuChuan: '',
        });
        setErrors({
            TenSan: '',
            DiaChiSan: '',
            SucChua: '',
            TieuChuan: '',
        });
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        let isValid = true;
        const newErrors = {};

        if (!stadium.TenSan.trim()) {
            newErrors.TenSan = 'Tên sân không được để trống.';
            isValid = false;
        }
        if (!stadium.DiaChiSan.trim()) {
            newErrors.DiaChiSan = 'Địa chỉ không được để trống.';
            isValid = false;
        }
        if (!stadium.SucChua) {
            newErrors.SucChua = 'Sức chứa không được để trống.';
            isValid = false;
        } else if (isNaN(stadium.SucChua) || parseInt(stadium.SucChua) <= 0) {
            newErrors.SucChua = 'Sức chứa phải là một số lớn hơn 0.';
            isValid = false;
        }
        if (!stadium.TieuChuan) {
            newErrors.TieuChuan = 'Tiêu chuẩn không được để trống.';
            isValid = false;
        } else if (isNaN(stadium.TieuChuan) || parseInt(stadium.TieuChuan) < 1 || parseInt(stadium.TieuChuan) > 5) {
            newErrors.TieuChuan = 'Tiêu chuẩn phải là một số từ 1 đến 5.';
            isValid = false;
        }

        setErrors(newErrors);

        if (isValid) {
            const newStadium = {
                ...stadium,
                SucChua: parseInt(stadium.SucChua, 10),
                TieuChuan: parseInt(stadium.TieuChuan, 10),
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
                navigate('/san-thi-dau');
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
                    <label htmlFor="TenSan">
                        Tên sân<strong><span style={{ color: 'red', marginLeft: '4px' }}>*</span></strong>
                    </label>
                    <input
                        type="text"
                        id="TenSan"
                        name="TenSan"
                        value={stadium.TenSan}
                        onChange={handleChange}
                    />
                    {errors.TenSan && <p className={styles['error-message']}>{errors.TenSan}</p>}
                </div>
                <div className={styles['form-group']}>
                    <label htmlFor="DiaChiSan">
                        Địa chỉ<strong><span style={{ color: 'red', marginLeft: '4px' }}>*</span></strong>
                    </label>
                    <input
                        type="text"
                        id="DiaChiSan"
                        name="DiaChiSan"
                        value={stadium.DiaChiSan}
                        onChange={handleChange}
                    />
                    {errors.DiaChiSan && <p className={styles['error-message']}>{errors.DiaChiSan}</p>}
                </div>
                <div className={styles['form-group']}>
                    <label htmlFor="SucChua">
                        Sức chứa<strong><span style={{ color: 'red', marginLeft: '4px' }}>*</span></strong>
                    </label>
                    <input
                        type="number"
                        id="SucChua"
                        name="SucChua"
                        value={stadium.SucChua}
                        onChange={handleChange}
                    />
                    {errors.SucChua && <p className={styles['error-message']}>{errors.SucChua}</p>}
                </div>
                <div className={styles['form-group']}>
                    <label htmlFor="TieuChuan">
                        Tiêu chuẩn (1-5 sao)<strong><span style={{ color: 'red', marginLeft: '4px' }}>*</span></strong>
                    </label>
                    <input
                        type="number"
                        id="TieuChuan"
                        name="TieuChuan"
                        value={stadium.TieuChuan}
                        onChange={handleChange}
                    />
                    {errors.TieuChuan && <p className={styles['error-message']}>{errors.TieuChuan}</p>}
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