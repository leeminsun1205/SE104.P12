import React from 'react';
import Swal from 'sweetalert2';
import styles from './HomePage.module.css';

function HomePage() {
  const handleGetStartedClick = () => {
    Swal.fire({
      title: 'Lỗi!',
      text: 'Tính năng đang được phát triển',
      icon: 'error',
      confirmButtonText: 'Tiếp tục',
      footer: '<a href="/">Why do I have this issue?</a>'
    });
  };
  
  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <header className={styles.banner}>
          <h1>Welcome to Football Championship Management</h1>
          <p>Get the latest updates on teams, matches, and standings.</p>
          <button className={styles.ctaButton} onClick={handleGetStartedClick}>
            Get Started
          </button>
        </header>

        <section className={styles.features}>
          <div className={styles.feature}>
            <h2>Upcoming Matches</h2>
            <p>Stay up to date with upcoming matches and events.</p>
          </div>
          <div className={styles.feature}>
            <h2>Team Standings</h2>
            <p>Check the latest standings of your favorite teams.</p>
          </div>
          <div className={styles.feature}>
            <h2>Player Highlights</h2>
            <p>Watch highlights of the best players in the league.</p>
          </div>
        </section>
      </div>
    </div>
  );
}

export default HomePage;
