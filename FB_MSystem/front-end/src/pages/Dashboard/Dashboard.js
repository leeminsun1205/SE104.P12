// src/pages/Dashboard/Dashboard.js
import React, { useState, useEffect } from 'react';
import styles from './Dashboard.module.css';
import { Bar } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);

function Dashboard() {
    const [teamsData, setTeamsData] = useState(null);
    const [matchesData, setMatchesData] = useState(null);
    const [chartData, setChartData] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch('http://localhost:5000/api/dashboard'); 
                if (!response.ok) {
                    throw new Error(`Lỗi HTTP! trạng thái: ${response.status}`);
                }
                const data = await response.json();
                setTeamsData(data.teams || []);
                setMatchesData(data.matches || []);
            } catch (error) {
                console.error("Lỗi khi tải dữ liệu bảng điều khiển:", error);
            }
        };

        fetchData();
    }, []);

    useEffect(() => {
        if (teamsData) {
            setChartData({
                labels: teamsData.map((team) => team.name),
                datasets: [
                    {
                        label: 'Tổng số bàn thắng',
                        data: teamsData.map((team) => team.goals || 0),
                        backgroundColor: 'rgba(54, 162, 235, 0.5)',
                        borderColor: 'rgba(54, 162, 235, 1)',
                        borderWidth: 1,
                    },
                ],
            });
        }
    }, [teamsData]);

    const topScorer = teamsData?.reduce((top, team) => (top && top.goals > (team.goals || 0) ? top : team), null);

    const chartOptions = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
            },
            title: {
                display: true,
                text: 'Số bàn thắng của các đội bóng hàng đầu',
            },
        },
        scales: {
            y: {
                beginAtZero: true,
                title: {
                    display: true,
                    text: 'Số bàn thắng',
                }
            },
            x: {
                title: {
                    display: true,
                    text: 'Đội bóng',
                }
            }
        },
    };

    return (
        <div className={styles.dashboard}>
            <h2 className={styles.title}>Bảng điều khiển</h2>
            <div className={styles.cards}>
                <div className={styles.card}>
                    <h3>Tổng số đội</h3>
                    <p>{teamsData?.length || 0}</p>
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
                    <p>{topScorer ? `${topScorer.name} - ${topScorer.goals || 0} Bàn thắng` : 'Không có dữ liệu'}</p>
                </div>
            </div>

            <div className={styles.graphs}>
                <div className={styles.graph}>
                    <h3>Số bàn thắng của các đội bóng hàng đầu</h3>
                    {chartData ? (
                        <Bar options={chartOptions} data={chartData} />
                    ) : (
                        <p>Đang tải dữ liệu...</p>
                    )}
                </div>
                <div className={styles.graph}>
                    <h3>Số lượng khán giả</h3>
                    <p>Biểu đồ giữ chỗ (Triển khai biểu đồ số lượng khán giả tại đây)</p>
                </div>
            </div>
        </div>
    );
}

export default Dashboard;