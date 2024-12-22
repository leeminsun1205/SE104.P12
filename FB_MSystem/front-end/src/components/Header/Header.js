// src/components/Header/Header.js
import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import styles from './Header.module.css';
import Button from '../Button/Button';

function Header({ onLogout, onToggleSidebar }) {
    return (
        <header className={styles.header}>
            <div className={styles.toggleButtonContainer}>
                <button className={styles.toggleButton} onClick={onToggleSidebar} aria-label="Toggle Sidebar">
                    ☰
                </button>
            </div>
            <div className={styles.logo}>
                <Link to="/">Football Championship Management</Link>
            </div>
            <nav className={styles.nav}>
                <NavLink to="/dashboard" className={({ isActive }) => isActive ? styles.active : styles.navLink}>
                    Dashboard
                </NavLink>
                <NavLink to="/teams" className={({ isActive }) => isActive ? styles.active : styles.navLink}>
                    Teams
                </NavLink>
                <NavLink to="/matches" className={({ isActive }) => isActive ? styles.active : styles.navLink}>
                    Matches
                </NavLink>
                <NavLink to="/standings" className={({ isActive }) => isActive ? styles.active : styles.navLink}>
                    Standings
                </NavLink>
                <NavLink to="/create" className={({ isActive }) => isActive ? styles.active : styles.navLink}>
                  Create New
              </NavLink>
            </nav>

            <div className={styles.userMenu}>
                <Button onClick={onLogout}>Logout</Button>
            </div>
        </header>
    );
}

export default Header;