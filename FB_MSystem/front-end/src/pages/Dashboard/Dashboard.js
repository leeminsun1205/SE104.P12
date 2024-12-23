// src/pages/Dashboard/Dashboard.js
import React, { useState, useEffect } from "react";
import styles from "./Dashboard.module.css";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

function Dashboard() {
  const [matchesData, setMatchesData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalTeams, setTotalTeams] = useState(0);
  const [topScorer, setTopScorer] = useState(null);
  const [chartData, setChartData] = useState(null);
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await fetch("http://localhost:5000/api/dashboard");
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        // setTeamsData(data.teams || []);
        setMatchesData(data.matches || []);
        setTotalTeams(data.totalTeams);
        setTopScorer(data.topScorer);
        const teamGoals = data.teams.map(team => ({
          name: team.name,
          goals: calculateGoalsForTeam(team.id, "2023-2024") 
        }));
  
        setChartData({
          labels: teamGoals.map(team => team.name),
          datasets: [
            {
              label: "Tổng số bàn thắng",
              data: teamGoals.map(team => team.goals),
              backgroundColor: "rgba(54, 162, 235, 0.5)",
              borderColor: "rgba(54, 162, 235, 1)",
              borderWidth: 1,
            },
          ],
        });
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };
  
    fetchData();
  }, []);
  
  // Hàm giả lập tính toán số bàn thắng cho mỗi đội
  function calculateGoalsForTeam(teamId, season) {
    const sampleGoals = {
      1: 25,
      2: 20,
      3: 18,
      4: 15,
      5: 12,
    }; 
  
    return sampleGoals[teamId] || 0;
  }

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "Số bàn thắng của các đội bóng",
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: "Số bàn thắng",
        },
      },
      x: {
        title: {
          display: true,
          text: "Đội bóng",
        },
      },
    },
  };

  if (loading) {
    return <div className={styles.loading}>Đang tải dữ liệu...</div>;
  }

  if (error) {
    return <div className={styles.error}>Lỗi: {error}</div>;
  }

  return (
    <div className={styles.dashboard}>
      <h2 className={styles.title}>Bảng điều khiển</h2>
      <div className={styles.cards}>
        <div className={styles.card}>
          <h3>Tổng số đội</h3>
          <p>{totalTeams}</p>
        </div>
        <div className={styles.card}>
          <h3>Trận đấu sắp tới</h3>
          <p>{matchesData?.filter((match) => !match.played).length || 0}</p>
        </div>
        <div className={styles.card}>
          <h3>Trận đấu đã hoàn thành</h3>
          <p>{matchesData?.filter((match) => match.played).length || 0}</p>
        </div>
        <div className={styles.card}>
          <h3>Vua phá lưới</h3>
          <p>
            {topScorer
              ? `${topScorer.name} - ${topScorer.goals || 0} Bàn thắng`
              : "Không có dữ liệu"}
          </p>
        </div>
      </div>

      <div className={styles.graphs}>
        <div className={styles.graph}>
          {chartData ? (
            <Bar options={chartOptions} data={chartData} />
          ) : (
            <p>Đang tải biểu đồ...</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;