import React from 'react';
import { useNavigate } from 'react-router-dom';
import './LookUp.css'; // Make sure the path is correct

function LookUp() {
    const navigate = useNavigate();

    const handleBackToDashboard = () => {
        navigate('/dashboard');
    };

    const handleToLookUpMatch = () => {
        navigate('/tra-cuu/tran-dau');
    };

    const handleToLookUpSeason = () => {
        navigate('/tra-cuu/mua-giai');
    };

    const handleToLookUpAchievements = () => {
        navigate('/tra-cuu/thanh-tich');
    };

    return (
        <div className="look-up-container">
            <button onClick={handleToLookUpMatch}>
                Lịch sử thi đấu
            </button>
            <button onClick={handleToLookUpSeason}>
                Lịch sử giải
            </button>
            <button onClick={handleToLookUpAchievements}>
                Thành tích
            </button>
            <button onClick={handleBackToDashboard}>
                Quay lại bảng điều khiển
            </button>
        </div>
    );
}

export default LookUp;