import React, { useState } from 'react';

function SeasonSelector({ onSeasonChange, seasons }) {
    const [selectedSeason, setSelectedSeason] = useState(seasons[0]); // Default to the first season

    const handleChange = (event) => {
        setSelectedSeason(event.target.value);
        onSeasonChange(event.target.value);
    };

    return (
        <div>
            <label htmlFor="season">Select Season:</label>
            <select id="season" value={selectedSeason} onChange={handleChange}>
                {seasons.map((season) => (
                    <option key={season} value={season}>
                        {season}
                    </option>
                ))}
            </select>
        </div>
    );
}

export default SeasonSelector;