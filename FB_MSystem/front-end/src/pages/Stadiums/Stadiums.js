// src/pages/Stadiums/Stadiums.js
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import styles from './Stadiums.module.css';

function Stadiums() {
    const [stadiums, setStadiums] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchStadiums = async () => {
            setIsLoading(true);
            try {
                const response = await fetch('http://localhost:5000/san-thi-dau');
                if (!response.ok) {
                    throw new Error('Failed to fetch stadiums');
                }
                const data = await response.json();
                setStadiums(data);
            } catch (error) {
                setError(error.message);
            } finally {
                setIsLoading(false);
            }
        };

        fetchStadiums();
    }, []);

    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);
    };

    const clearSearch = () => {
        setSearchTerm('');
    };

    const filteredStadiums = stadiums.filter((stadium) =>
        stadium.TenSan.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

     return (
        <div className={styles['stadium-container']}>
            <div className={styles["stadiums-list"]}>
                <h2>Danh sách sân vận động</h2>
                <div className={styles['actions']}>
                    <Link to="/tao-moi/san-thi-dau" className={styles['add-stadium-button']}>
                        Thêm sân vận động
                    </Link>
                </div>

                <div className={styles['search-container']}>
                    <div className="search-input-wrapper">
                        <p>Tìm kiếm</p>
                        <input
                            type="text"
                            placeholder="Tìm kiếm sân vận động..."
                            value={searchTerm}
                            onChange={handleSearchChange}
                        />
                        {searchTerm && (
                            <button className={styles["stadium-clear-search"]} onClick={clearSearch}>
                                ✕
                            </button>
                        )}
                    </div>
                </div>

                <ul>
                    {filteredStadiums.map((stadium) => (
                        <li key={stadium.MaSan}>
                            <Link to={`/san-thi-dau/${stadium.MaSan}`}>
                                {stadium.TenSan}
                            </Link>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}
export default Stadiums;