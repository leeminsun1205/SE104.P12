// src/pages/DashboardPage/Dashboard.js
import React from 'react';
import styles from './Dashboard.module.css';

function Dashboard() {
  return (
    <div className={styles.dashboard}>
      <h2 className={styles.title}>Dashboard</h2>
      <div className={styles.cards}>
        <div className={styles.card}>
          <h3>Total Teams</h3>
          <p>10</p>
        </div>
        <div className={styles.card}>
          <h3>Upcoming Matches</h3>
          <p>5</p>
        </div>
        <div className={styles.card}>
          <h3>Completed Matches</h3>
          <p>8</p>
        </div>
        <div className={styles.card}>
          <h3>Top Scorer</h3>
          <p>John Doe - 15 Goals</p>
        </div>
      </div>

      {/* Placeholder for Graphs */}
      <div className={styles.graphs}>
        <div className={styles.graph}>
          <h3>Goals Scored by Top Teams</h3>
          {/* You can insert a graph component here */}
          <p>Graph Placeholder</p>
        </div>
        <div className={styles.graph}>
          <h3>Match Attendance</h3>
          {/* You can insert a graph component here */}
          <p>Graph Placeholder</p>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
