import React from 'react';
import styles from './HomePage.module.css';

function HomePage() {
  return (
    <div className={styles.homepage}>
      <header className={styles.banner}>
        <h1>Welcome to Football Championship Management</h1>
        <p>Get the latest updates on teams, matches, and standings.</p>
        <button className={styles.ctaButton}>Get Started</button>
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
  );
}

export default HomePage;
