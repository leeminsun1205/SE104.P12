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
                    Bảng điều khiển
                </NavLink>
                <NavLink to="/teams" className={({ isActive }) => isActive ? styles.active : styles.navLink}>
                    Đội bóng
                </NavLink>
                <NavLink to="/matches" className={({ isActive }) => isActive ? styles.active : styles.navLink}>
                    Trận đấu
                </NavLink>
                <NavLink to="/standings" className={({ isActive }) => isActive ? styles.active : styles.navLink}>
                    Bảng xếp hạng
                </NavLink>
                <NavLink to="/create" className={({ isActive }) => isActive ? styles.active : styles.navLink}>
                  Thêm mới
              </NavLink>
            </nav>

            <div className={styles.userMenu}>
                <Button  className="logout-button" onClick={onLogout}> Thoát</Button>
            </div>
        </header>
    );
}

export default Header;