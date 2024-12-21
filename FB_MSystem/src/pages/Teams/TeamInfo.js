import React from 'react';
import { useParams, useNavigate } from 'react-router-dom'; 
import './TeamInfo.css';
import defaultHomeImage from '../../assets/images/teams/default_home.png';
import defaultAwayImage from '../../assets/images/teams/default_away.png';

function TeamInfo({ teams }) {
    const { id } = useParams();
    const navigate = useNavigate();
    const teamId = parseInt(id, 10);
    const team = teams.find((t) => t.id === teamId);

    if (!team) {
        return (
            <div className="team-info">
                <p>Team not found.</p>
                <button className="go-back-button" onClick={() => navigate(-1)}>
                    Go Back
                </button>
            </div>
        );
    }

    return (
        <div className="team-info">
            <button className="go-back-button" onClick={() => navigate(-1)}>
                Go Back
            </button>
            <div className="uniform-images">
                <img
                    src={
                        team.home_kit_image instanceof File
                            ? URL.createObjectURL(team.home_kit_image)
                            : team.home_kit_image || defaultHomeImage
                    }
                    alt={`${team.name} Home Uniform`}
                    className="uniform-image"
                    loading="lazy"
                />
                <img
                    src={
                        team.away_kit_image instanceof File
                            ? URL.createObjectURL(team.away_kit_image)
                            : team.away_kit_image || defaultAwayImage
                    }
                    alt={`${team.name} Away Uniform`}
                    className="uniform-image"
                    loading="lazy"
                />
            </div>
            <div className="team-details">
                <h2>{team.name}</h2>
                <ul>
                    <li><strong>Thành phố:</strong> {team.city}</li>
                    <li><strong>Cơ quan/Công ty chủ quản:</strong> {team.managing_body}</li>
                    <li><strong>Sân nhà:</strong> {team.stadium}</li>
                    <li><strong>Sức chứa:</strong> {team.capacity}</li>
                    <li><strong>FIFA Stars:</strong> {team.fifa_stars}</li>
                </ul>
                <p><strong>Giới thiệu:</strong> {team.description}</p>
            </div>
        </div>
    );
}

export default TeamInfo;
