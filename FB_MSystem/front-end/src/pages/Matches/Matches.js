// src/pages/Matches/Matches.js


import React, { useState } from 'react';
import SeasonSelector from '../../components/SeasonSelector/SeasonSelector'; // Import the selector
import './Matches.css';

const allMatches = [
  { id: 1, homeTeam: 'Team A', awayTeam: 'Team B', date: '2024-01-15', time: '18:00', season: '2023-2024' },
  { id: 2, homeTeam: 'Team C', awayTeam: 'Team A', date: '2024-01-17', time: '20:00', season: '2023-2024' },
  { id: 3, homeTeam: 'Team B', awayTeam: 'Team C', date: '2024-01-20', time: '19:00', season: '2022-2023' },
];
const seasons = [...new Set(allMatches.map(match => match.season))];

function Matches() {
    const [selectedSeason, setSelectedSeason] = useState(seasons[0]);
    const matches = allMatches.filter(match => match.season === selectedSeason);

    return (
        <div className="matches">
            <SeasonSelector onSeasonChange={setSelectedSeason} seasons={seasons} />
            <h2>Danh sách trận đấu</h2>
            <ul>
              {matches.map(match => (
                <li key={match.id}>
                  <p>{match.homeTeam} vs {match.awayTeam}</p>
                  <p>Ngày: {match.date}, Giờ: {match.time}</p>
                </li>
              ))}
            </ul>        
      </div>
    );
}

export default Matches;