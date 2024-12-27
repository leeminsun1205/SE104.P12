// src/pages/Seasons/SeasonList.js
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import styles from './SeasonList.module.css';

function SeasonsList({ API_URL }) {
    const [seasons, setSeasons] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchSeasons = async () => {
            setLoading(true);
            setError(null);
            try {
                const response = await fetch(`${API_URL}/mua-giai`);
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();
                setSeasons(data.muaGiai);
            } catch (error) {
                console.error("Error fetching seasons:", error);
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchSeasons();
    }, [API_URL]);

    if (loading) {
        return <p>Đang tải danh sách mùa giải...</p>;
    }

    if (error) {
        return <p className={styles['error-message']}>Lỗi khi tải dữ liệu mùa giải: {error}</p>;
    }

    return (

        <div className={styles['seasons-list-container']}>
            <h2>Danh sách các mùa giải</h2>
            <Link to="/tao-moi/mua-giai" className="add-player-button">
                Thêm mùa giải mới
            </Link>
            {seasons.length === 0 ? (
                <p>Không có mùa giải nào được tạo.</p>
            ) : (
                <ul className={styles['seasons-list']}>
                    {seasons.map(season => (
                        <li key={season.MaMuaGiai} className={styles['season-item']}>
                            <Link to={`/mua-giai/${season.MaMuaGiai}`} className={styles['season-link']}>
                                <span className={styles['season-name']}>{season.TenMuaGiai}</span>
                                <span className={styles['season-dates']}>
                                    {new Date(season.NgayBatDau).toLocaleDateString()} -{' '}
                                    {new Date(season.NgayKetThuc).toLocaleDateString()}
                                </span>
                            </Link>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}

export default SeasonsList;