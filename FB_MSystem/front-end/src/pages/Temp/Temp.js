// /src/pages/Temp/Temp.js

import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Temp.css'; // Import the CSS file

function Temp() {
    const navigate = useNavigate();

    const handleBackToDashboard = () => {
        navigate('/homepage'); // Navigate to the Dashboard
    };

    return (
        <div className="temp-container">
            <h1>Why are you here?</h1>
            <p>Cause you suck!</p>
            <button onClick={handleBackToDashboard}>
                Back to Dashboard
            </button>
        </div>
    );
}

export default Temp;
