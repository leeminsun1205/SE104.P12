// src/components/Sidebar/Sidebar.js
import React from 'react';
import { NavLink } from 'react-router-dom';
import styles from './Sidebar.module.css';

function Sidebar() {
  return (
    <aside className={styles.sidebar}>
      <div className={styles.logo}>
        <h2>Football App</h2>
      </div>
      <nav className={styles.nav}>
        <NavLink to="/dashboard" className={styles.navLink} activeClassName={styles.active}>
          <i className="fas fa-tachometer-alt"></i> Dashboard
        </NavLink>
        <NavLink to="/teams" className={styles.navLink} activeClassName={styles.active}>
          <i className="fas fa-users"></i> Teams
        </NavLink>
        <NavLink to="/matches" className={styles.navLink} activeClassName={styles.active}>
          <i className="fas fa-futbol"></i> Matches
        </NavLink>
        <NavLink to="/standings" className={styles.navLink} activeClassName={styles.active}>
          <i className="fas fa-list-ol"></i> Standings
        </NavLink>
      </nav>
    </aside>
  );
}

export default Sidebar;
