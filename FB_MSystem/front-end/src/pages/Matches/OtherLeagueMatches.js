import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './OtherLeagueMatches.css';

function OtherLeagueMatches() {
    const navigate = useNavigate();
    const initialMatches = [
        { id: 1, league_name: 'League X', match_date: '2023-12-25' },
        { id: 2, league_name: 'League Y', match_date: '2024-01-15' },
        { id: 3, league_name: 'League Z', match_date: '2024-02-20' },
        { id: 4, league_name: 'League X', match_date: '2024-03-10' },
    ];

    const [matches, setMatches] = useState(initialMatches);
    const [sortConfig, setSortConfig] = useState({ key: null, direction: null });

    // Sorting function
    const sortMatches = (key) => {
        const direction = sortConfig.key === key && sortConfig.direction === 'asc' ? 'desc' : 'asc';
        const sortedMatches = [...matches].sort((a, b) => {
            if (a[key] < b[key]) return direction === 'asc' ? -1 : 1;
            if (a[key] > b[key]) return direction === 'asc' ? 1 : -1;
            return 0;
        });
        setSortConfig({ key, direction });
        setMatches(sortedMatches);
    };
    const handleNavigate = () => {
        navigate(-1)
    }
    return (
        <div className="team-matches">
            <button
                className="go-back-button"
                onClick={() => handleNavigate()}
            >
                Quay lại
            </button>
            <h2>Lịch thi đấu giải đấu khác</h2>

            <table>
                <thead>
                    <tr>
                        <th
                            className="table-header-cell"
                            onClick={() => sortMatches('league_name')}
                            style={{ cursor: 'pointer' }}
                        >
                            Giải đấu{sortConfig.key === 'league_name' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                        </th>
                        <th
                            className="table-header-cell"
                            onClick={() => sortMatches('match_date')}
                            style={{ cursor: 'pointer' }}
                        >
                            Lịch thi đấu {sortConfig.key === 'match_date' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {matches.map((match) => (
                        <tr key={match.id}>
                            <td className="table-cell">{match.league_name}</td>
                            <td className="table-cell">{match.match_date}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default OtherLeagueMatches;
