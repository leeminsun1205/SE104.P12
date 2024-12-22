import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import styles from "./MatchDetails.module.css";

const allMatches = [
  {
    id: 1,
    homeTeam: "Team A",
    awayTeam: "Team B",
    date: "2024-01-15",
    time: "18:00",
    season: "2023-2024",
    round: "1",
    stadium: "Sân Mỹ Đình",
  },
  {
    id: 2,
    homeTeam: "Team C",
    awayTeam: "Team A",
    date: "2024-01-17",
    time: "20:00",
    season: "2023-2024",
    round: "1",
    stadium: "Sân Hàng Đẫy",
  },
  {
    id: 3,
    homeTeam: "Team B",
    awayTeam: "Team C",
    date: "2024-01-20",
    time: "19:00",
    season: "2022-2023",
    round: "2",
    stadium: "Sân Thống Nhất",
  },
  // Add more matches here
];

function MatchDetails() {
  const { season, round, id } = useParams();
  const navigate = useNavigate();

  const match = allMatches.find(
    (m) => m.id.toString() === id && m.season === season && m.round === round
  );

  if (!match) {
    return (
      <div className={styles.notFound}>
        <h2>Trận đấu không tồn tại</h2>
        <p>Vui lòng kiểm tra lại thông tin.</p>
        <button className={styles.backButton} onClick={() => navigate("/matches")}>
          Quay lại danh sách trận đấu
        </button>
      </div>
    );
  }

  return (
    <div className={styles.matchDetails}>
      <h1 className={styles.matchTitle}>
        {match.homeTeam} <span>vs</span> {match.awayTeam}
      </h1>
      <div className={styles.matchInfo}>
        <div className={styles.infoItem}>
          <span className={styles.label}>Mùa giải:</span> {match.season}
        </div>
        <div className={styles.infoItem}>
          <span className={styles.label}>Vòng đấu:</span> {match.round}
        </div>
        <div className={styles.infoItem}>
          <span className={styles.label}>Ngày:</span> {match.date}
        </div>
        <div className={styles.infoItem}>
          <span className={styles.label}>Giờ:</span> {match.time}
        </div>
        <div className={styles.infoItem}>
          <span className={styles.label}>Sân vận động:</span> {match.stadium}
        </div>
      </div>
      <button className={styles.backButton} onClick={() => navigate("/matches")}>
        Quay lại danh sách trận đấu
      </button>
    </div>
  );
}

export default MatchDetails;
