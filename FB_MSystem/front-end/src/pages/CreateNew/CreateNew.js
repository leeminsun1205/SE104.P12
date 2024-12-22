import React from 'react';
import { useNavigate } from 'react-router-dom'// Import the CSS file
import "./CreateNew.css"

function CreatNew() {
    const navigate = useNavigate();

    const handleBackToDashboard = () => {
        navigate('/homepage'); // Navigate to the Dashboard
    };
    const handleToCreateTeam = () => {
        navigate('/create/team');
    }

    return (
        <div className="create-new-container">
            <button onClick={handleBackToDashboard}>
                Back to Dashboard
            </button>
            <button onClick={handleToCreateTeam}>
                Create Team
            </button>
        </div>
    );
}

export default CreatNew;