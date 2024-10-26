// src/components/Header/Header.js
import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import styles from './Header.module.css';

function Header() {
  return (
    <header className={styles.header}>
      <div className={styles.logo}>
        <Link to="/">Football Championship</Link>
      </div>
      <nav className={styles.nav}>
        <NavLink to="/dashboard" className={styles.navLink} activeClassName={styles.active}>Dashboard</NavLink>
        <NavLink to="/teams" className={styles.navLink} activeClassName={styles.active}>Teams</NavLink>
        <NavLink to="/matches" className={styles.navLink} activeClassName={styles.active}>Matches</NavLink>
        <NavLink to="/standings" className={styles.navLink} activeClassName={styles.active}>Standings</NavLink>
      </nav>
      <div className={styles.userMenu}>
        <img src="/path/to/avatar.jpg" alt="User Avatar" className={styles.avatar} />
        <span className={styles.userName}>John Doe</span>
      </div>
    </header>
  );
}

export default Header;
