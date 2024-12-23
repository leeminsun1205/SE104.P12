import React, { useState } from "react";
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
    isFinished: true, 
    homeScore: 2,    
    awayScore: 1,   
    goals: [      
      {
        player: "Cầu thủ A1",
        team: "Team A",
        type: "Pen",
        time: "15'"
      },
      {
        player: "Cầu thủ A2",
        team: "Team A",
        type: "Đánh đầu",
        time: "45'"
      },
      {
        player: "Cầu thủ B1",
        team: "Team B",
        type: "Sút xa",
        time: "60'"
      },
    ]
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
    isFinished: false,
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
    isFinished: true,
    homeScore: 0,
    awayScore: 0,
    goals: []
  },
  // Add more matches here
];

function MatchDetails() {
  const { season, round, id } = useParams();
  const navigate = useNavigate();
  const [showDetails, setShowDetails] = useState(false);

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

  const toggleDetails = () => {
    setShowDetails(!showDetails);
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

      {/* Button để hiện/ẩn thông tin chi tiết */}
      {match.isFinished && (
        <button className={styles.detailsButton} onClick={toggleDetails}>
          {showDetails ? "Ẩn thông tin chi tiết" : "Hiện thông tin chi tiết"}
        </button>
      )}

      {/* Thông tin chi tiết trận đấu */}
      {match.isFinished && showDetails && (
        <div className={styles.matchDetailsContainer}>
          <table className={styles.matchDetailsTable}>
            <thead>
              <tr>
                <th>Đội 1:</th>
                <th>{match.homeTeam}</th>
              </tr>
              <tr>
                <th>Đội 2:</th>
                <th>{match.awayTeam}</th>
              </tr>
              <tr>
                <th>Tỷ số:</th>
                <th>{match.homeScore} - {match.awayScore}</th>
              </tr>
              <tr>
                <th>Sân đấu:</th>
                <th>{match.stadium}</th>
              </tr>
              <tr>
                <th>Ngày:</th>
                <th>{match.date}</th>
              </tr>
              <tr>
                <th>Thời gian:</th>
                <th>{match.time}</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td colSpan="2">
                  <table className={styles.goalTable}>
                    <thead>
                      <tr>
                        <th>Cầu thủ</th>
                        <th>Đội</th>
                        <th>Loại bàn thắng</th>
                        <th>Thời điểm ghi bàn</th>
                      </tr>
                    </thead>
                    <tbody>
                      {match.goals.map((goal, index) => (
                        <tr key={index}>
                          <td>{goal.player}</td>
                          <td>{goal.team}</td>
                          <td>{goal.type}</td>
                          <td>{goal.time}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </td>
              </tr>
            </tbody>
          </table>
          
        </div>
      )}

      <button className={styles.backButton} onClick={() => navigate("/matches")}>
        Quay lại danh sách trận đấu
      </button>
    </div>
  );
}

export default MatchDetails;