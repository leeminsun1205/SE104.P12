import React from 'react';
import { useNavigate } from 'react-router-dom';
import './LookUp.css'; // Make sure the path is correct

function LookUp() {
    const navigate = useNavigate();

    const handleBackToDashboard = () => {
        navigate('/dashboard');
    };

    const handleToLookUpMatch = () => {
        navigate('/lookup/match');
    };

    const handleToLookUpSeason = () => {
        navigate('/lookup/season');
    };

    const handleToLookUpAchievements = () => {
        navigate('/lookup/achievements');
    };

    return (
        <div className="look-up-container">
            <button onClick={handleBackToDashboard}>
                Quay lại bảng điều khiển
            </button>
            <button onClick={handleToLookUpMatch}>
                Lịch sử thi đấu
            </button>
            <button onClick={handleToLookUpSeason}>
                Lịch sử giải
            </button>
            <button onClick={handleToLookUpAchievements}>
                Thành tích
            </button>
        </div>
    );
}

export default LookUp;