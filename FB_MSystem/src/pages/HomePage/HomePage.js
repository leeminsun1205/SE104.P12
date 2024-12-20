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
      footer: '<a href="http://localhost:3001/temp">Why do I have this issue?</a>',
    });
  };

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <header className={styles.banner}>
          <h1>Chào mừng đến với Phần mềm Quản lý giải Bóng đá </h1>
          <p>Quản lý giải đấu, đội bóng và cầu thủ của bạn một cách dễ dàng.</p>
          <button className={styles.ctaButton} onClick={handleGetStartedClick}>
            Get Started
          </button>
          {/* Consider adding a "Learn More" button if appropriate */}
        </header>

        <section className={styles.features}>
          <div className={styles.feature}>
            <img
              src="/images/upcoming-matches.svg" // Replace with actual image path
              alt="Upcoming Matches"
            />
            <h2>Upcoming Matches</h2>
            <p>Stay up to date with upcoming fixtures and events.</p>
          </div>
          <div className={styles.feature}>
            <img
              src="/images/team-standings.svg" // Replace with actual image path
              alt="Team Standings"
            />
            <h2>Team Standings</h2>
            <p>Check the latest standings of your favorite teams.</p>
          </div>
          <div className={styles.feature}>
            <img
              src="/images/player-highlights.svg" // Replace with actual image path
              alt="Player Highlights"
            />
            <h2>Player Highlights</h2>
            <p>Watch highlights of the best players in the league.</p>
          </div>
        </section>
      </div>
    </div>
  );
}

export default HomePage;