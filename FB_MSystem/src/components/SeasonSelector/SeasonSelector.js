// /src/components/SeasonSelector/SeasonSelector.js

import React, { useState } from 'react';
import styled from 'styled-components';

// Styled components for styling
const Container = styled.div`
    display: flex;
    flex-direction: column;
    margin: 1rem 0;
    font-family: Arial, sans-serif;
`;

const Label = styled.label`
    margin-bottom: 0.5rem;
    font-weight: bold;
    color: #333;
`;

const Select = styled.select`
    padding: 0.5rem;
    font-size: 1rem;
    border: 2px solid #007bff;
    border-radius: 4px;
    background-color: #f8f9fa;
    color: #333;

    &:focus {
        outline: none;
        border-color: #0056b3;
        box-shadow: 0 0 5px rgba(0, 91, 187, 0.5);
    }
`;

const Option = styled.option`
    padding: 0.5rem;
`;

function SeasonSelector({ onSeasonChange, seasons }) {
    const [selectedSeason, setSelectedSeason] = useState(seasons[0]); // Default to the first season

    const handleChange = (event) => {
        setSelectedSeason(event.target.value);
        onSeasonChange(event.target.value);
    };

    return (
        <Container>
            <Label htmlFor="season">Mùa giải:</Label>
            <Select id="season" value={selectedSeason} onChange={handleChange}>
                {seasons.map((season) => (
                    <Option key={season} value={season}>
                        {season}
                    </Option>
                ))}
            </Select>
        </Container>
    );
}

export default SeasonSelector;
