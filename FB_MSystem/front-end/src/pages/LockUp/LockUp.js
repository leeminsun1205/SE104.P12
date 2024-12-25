import React from 'react';
import { useNavigate } from 'react-router-dom';
import './LockUp.css'; // Make sure the path is correct

function LockUp() {
    const navigate = useNavigate();

    const handleBackToDashboard = () => {
        navigate('/dashboard');
    };

    const handleToLockUpMatch = () => {
        navigate('/lockup/match');
    };

    const handleToLockUpSeason = () => {
        navigate('/lockup/season');
    };

    const handleToLockUpAchievements = () => {
        navigate('/lockup/achievements');
    };

    return (
        <div className="lock-up-container">
            <button onClick={handleBackToDashboard}>
                Quay lại bảng điều khiển
            </button>
            <button onClick={handleToLockUpMatch}>
                Lịch sử thi đấu
            </button>
            <button onClick={handleToLockUpSeason}>
                Lịch sử giải
            </button>
            <button onClick={handleToLockUpAchievements}>
                Thành tích
            </button>
        </div>
    );
}

export default LockUp;