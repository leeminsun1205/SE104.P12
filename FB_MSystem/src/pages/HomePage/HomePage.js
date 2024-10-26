// src/pages/HomePage.js
import React from 'react';
import './HomePage.css';

function HomePage() {
  return (
    <div className="homepage">
      <header className="banner">
        <h1>Welcome to Football Championship</h1>
        <p>Get the latest updates on teams, matches, and standings.</p>
        <button className="cta-button">Get Started</button>
      </header>

      <section className="features">
        <div className="feature">
          <h2>Upcoming Matches</h2>
          <p>Stay up to date with upcoming matches and events.</p>
        </div>
        <div className="feature">
          <h2>Team Standings</h2>
          <p>Check the latest standings of your favorite teams.</p>
        </div>
        <div className="feature">
          <h2>Player Highlights</h2>
          <p>Watch highlights of the best players in the league.</p>
        </div>
      </section>
    </div>
  );
}

export default HomePage;
