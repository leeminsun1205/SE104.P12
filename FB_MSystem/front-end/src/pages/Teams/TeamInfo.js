import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './TeamInfo.css';
import defaultHomeImage from '../../assets/images/teams/default_home.png';
import defaultAwayImage from '../../assets/images/teams/default_away.png';
import defaultThirdImage from '../../assets/images/teams/default_away.png';

function TeamInfo({ teams }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const teamId = parseInt(id, 10);
  const team = teams.find((t) => t.id === teamId);

  const handleToPlayer = (id) => {
    navigate(`/doi-bong/${id}/cau-thu`);
  };

  // const handleToOtherMatches = (id) => {
  //   navigate(`/doi-bong/${id}/other-matches`); 
  // };

  const handleStadiumClick = (stadiumId) => {
    navigate(`/san-thi-dau/${stadiumId}`);
  };

  if (!team) {
    return (
      <div className="team-info">
        <p>Không tìm thấy đội bóng.</p>
        <button className="go-back-button" onClick={() => navigate(-1)}>
          Quay lại
        </button>
      </div>
    );
  }

  return (
    <div className="team-info">
      <button className="go-back-button" onClick={() => navigate(-1)}>
        Quay lại
      </button>
      <div className="team-details">
        <h2>Thông tin đội bóng {team.TenDoiBong}</h2>
        <ul>
          <li>
            <strong>Thành phố:</strong> {team.ThanhPhoTrucThuoc}
          </li>
          <li>
            <strong>Huấn luyện viên:</strong> {team.TenHLV}
          </li>
          <li>
            <strong>Sân nhà:</strong>{" "}
            <span
              onClick={() => handleStadiumClick(team.MaSan)}
              style={{ cursor: 'pointer', textDecoration: 'underline' }}
            >
              {team.SanThiDau ? team.SanThiDau.TenSan : 'N/A'}
            </span>
          </li>
          <li>
            <strong>Sức chứa:</strong> {team.SucChua}
          </li>
          <li>
            <strong>Đạt tiêu chuẩn (số sao):</strong> {team.TieuChuan}{" "}
            <strong>của Liên đoàn bóng đá Thế giới</strong>
          </li>
        </ul>
        <p className="team-description">
          <strong>Giới thiệu đội:</strong>
          <span>{team.ThongTin}</span>
        </p>
      </div>
      <div className="uniform-images">
        <div className="kit-container">
          <p className="kit-label">Áo sân nhà</p>
          <img
            src={
              team.home_kit_image instanceof File
                ? URL.createObjectURL(team.home_kit_image)
                : team.home_kit_image || defaultHomeImage
            }
            alt={`${team.TenDoiBong} Home Uniform`}
            className="uniform-image"
            loading="lazy"
          />
        </div>
        <div className="kit-container">
          <p className="kit-label">Áo sân khách</p>
          <img
            src={
              team.away_kit_image instanceof File
                ? URL.createObjectURL(team.away_kit_image)
                : team.away_kit_image || defaultAwayImage
            }
            alt={`${team.TenDoiBong} Away Uniform`}
            className="uniform-image"
            loading="lazy"
          />
        </div>
        <div className="kit-container">
          <p className="kit-label">Áo dự bị</p>
          <img
            src={
              team.third_kit_image instanceof File
                ? URL.createObjectURL(team.third_kit_image)
                : team.third_kit_image || defaultThirdImage
            }
            alt={`${team.name} Third Uniform`}
            className="uniform-image"
            loading="lazy"
          />
        </div>
      </div>
      <div className="action">
        <button className="to-player" onClick={() => handleToPlayer(team.MaDoi)}>
          Cầu thủ
        </button>
        {/* <button
          className="to-other-matches"
          onClick={() => handleToOtherMatches(team.MaDoi)}
        >
          Giải đấu khác
        </button> */}
      </div>
    </div>
  );
}


export default TeamInfo