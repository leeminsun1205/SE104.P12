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
                const response = await fetch(`${API_URL}/seasons`);
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();
                setSeasons(data.seasons);
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
            {seasons.length === 0 ? (
                <p>Không có mùa giải nào được tạo.</p>
            ) : (
                <ul className={styles['seasons-list']}>
                    {seasons.map(season => (
                        <li key={season.id} className={styles['season-item']}>
                            <Link to={`/seasons/${season.id}`} className={styles['season-link']}>
                                <span className={styles['season-name']}>{season.name}</span>
                                <span className={styles['season-dates']}>
                                    {new Date(season.startDate).toLocaleDateString()} -{' '}
                                    {new Date(season.endDate).toLocaleDateString()}
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