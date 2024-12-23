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
                const response = await fetch('/api/dashboard'); // Replace with your actual API endpoint
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();
                setTeamsData(data.teams || []);
                setMatchesData(data.matches || []);
            } catch (error) {
                console.error("Error fetching dashboard data:", error);
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
                        label: 'Total Goals',
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
                text: 'Goals Scored by Top Teams',
            },
        },
        scales: {
            y: {
                beginAtZero: true,
                title: {
                    display: true,
                    text: 'Goals',
                }
            },
            x: {
                title: {
                    display: true,
                    text: 'Teams'
                }
            }
        },
    };

    return (
        <div className={styles.dashboard}>
            <h2 className={styles.title}>Dashboard</h2>
            <div className={styles.cards}>
                <div className={styles.card}>
                    <h3>Total Teams</h3>
                    <p>{teamsData?.length || 0}</p>
                </div>
                <div className={styles.card}>
                    <h3>Upcoming Matches</h3>
                    <p>{matchesData?.filter((match) => !match.played).length || 0}</p>
                </div>
                <div className={styles.card}>
                    <h3>Completed Matches</h3>
                    <p>{matchesData?.filter((match) => match.played).length || 0}</p>
                </div>
                <div className={styles.card}>
                    <h3>Top Scorer</h3>
                    <p>{topScorer ? `${topScorer.name} - ${topScorer.goals || 0} Goals` : 'No data'}</p>
                </div>
            </div>

            <div className={styles.graphs}>
                <div className={styles.graph}>
                    <h3>Goals Scored by Top Teams</h3>
                    {chartData ? (
                        <Bar options={chartOptions} data={chartData} />
                    ) : (
                        <p>Loading data...</p>
                    )}
                </div>
                <div className={styles.graph}>
                    <h3>Match Attendance</h3>
                    <p>Graph Placeholder (Implement Attendance Graph Here)</p>
                </div>
            </div>
        </div>
    );
}

export default Dashboard;