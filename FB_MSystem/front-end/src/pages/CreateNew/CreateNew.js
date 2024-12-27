import React from 'react';
import { useNavigate } from 'react-router-dom';
import './CreateNew.css'; // Make sure the path is correct

function CreateNew() {
    const navigate = useNavigate();

    const handleBackToDashboard = () => {
        navigate('/dashboard');
    };

    const handleToCreateTeam = () => {
        navigate('/tao-moi/doi-bong');
    };

    const handleToCreatePlayer = () => {
        navigate('/tao-moi/cau-thu');
    };

    const handleToCreateStadium = () => {
        navigate('/tao-moi/san-thi-dau');
    };

    const handleToCreateSeason = () => {
        navigate('/tao-moi/mua-giai');
    };

    return (
        <div className="create-new-container">
            <button onClick={handleToCreateTeam}>
                Thêm đội bóng
            </button>
            <button onClick={handleToCreatePlayer}>
                Thêm cầu thủ
            </button>
            <button onClick={handleToCreateStadium}>
                Thêm sân vận động
            </button>
            <button onClick={handleToCreateSeason}>
                Thêm mùa giải
            </button>
            <button onClick={handleBackToDashboard}>
                Quay lại bảng điều khiển
            </button>
        </div>
    );
}

export default CreateNew;