// src/components/Header/Header.js
import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import styles from './Header.module.css';
import Button from '../Button/Button';

function Header({ onLogout }) { // Nhận prop onLogout từ App.js
  return (
    <header className={styles.header}>
      <div className={styles.logo}>
        <Link to="/">Football Championship Management</Link>
      </div>
      <nav className={styles.nav}>
        <NavLink to="/dashboard" className={({ isActive }) => isActive ? styles.active : styles.navLink}>Dashboard</NavLink>
        <NavLink to="/teams" className={({ isActive }) => isActive ? styles.active : styles.navLink}>Teams</NavLink>
        <NavLink to="/matches" className={({ isActive }) => isActive ? styles.active : styles.navLink}>Matches</NavLink>
        <NavLink to="/standings" className={({ isActive }) => isActive ? styles.active : styles.navLink}>Standings</NavLink>
      </nav>
      
      <div className={styles.userMenu}>
        <Button onClick={onLogout}>Logout</Button> {/* Gọi onLogout khi bấm nút */}
      </div>
      
    </header>
  );
}

export default Header;
