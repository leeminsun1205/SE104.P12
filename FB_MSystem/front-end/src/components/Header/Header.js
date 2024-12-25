// src/components/Header/Header.js
import React, { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import styles from './Header.module.css';
import Button from '../Button/Button';

function Header({ onLogout, onToggleSidebar }) {
    const [showLeagueDropdown, setShowLeagueDropdown] = useState(false);
    const [showSettingsDropdown, setShowSettingsDropdown] = useState(false);

    const toggleLeagueDropdown = () => {
        setShowLeagueDropdown(!showLeagueDropdown);
        // Close the settings dropdown when opening the league dropdown
        if (showSettingsDropdown) {
            setShowSettingsDropdown(false);
        }
    };

    const toggleSettingsDropdown = () => {
        setShowSettingsDropdown(!showSettingsDropdown);
        // Close the league dropdown when opening the settings dropdown
        if (showLeagueDropdown) {
            setShowLeagueDropdown(false);
        }
    };

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
                <div className={styles.dropdown}>
                    <button className={styles.dropbtn} onClick={toggleLeagueDropdown}>
                        Quản lý giải đấu <i className="fa fa-caret-down"></i>
                    </button>
                    <div className={`${styles.dropdownContent} ${showLeagueDropdown ? styles.show : ''}`}>
                        <NavLink to="/seasons" className={({ isActive }) => isActive ? styles.active : styles.navLink}>
                            Mùa giải
                        </NavLink>
                        <NavLink to="/teams" className={({ isActive }) => isActive ? styles.active : styles.navLink}>
                            Đội bóng
                        </NavLink>
                        <NavLink to="/stadiums" className={({ isActive }) => isActive ? styles.active : styles.navLink}>
                            Sân vận động
                        </NavLink>
                        <NavLink to="/players" className={({ isActive }) => isActive ? styles.active : styles.navLink}>
                           Cầu thủ
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
                        <NavLink to="/invoices" className={({ isActive }) => isActive ? styles.active : styles.navLink}>
                            Biên nhận lệ phí
                        </NavLink>
                    </div>
                </div>
                <div className={styles.dropdown}>
                    <button className={styles.dropbtn} onClick={toggleSettingsDropdown}>
                        Cài đặt <i className="fa fa-caret-down"></i>
                    </button>
                    <div className={`${styles.dropdownContent} ${showSettingsDropdown ? styles.show : ''}`}>
                        <NavLink to="/settings/general" className={({ isActive }) => isActive ? styles.active : styles.navLink}>
                            Cài đặt chung
                        </NavLink>
                        <NavLink to="/settings/types" className={({ isActive }) => isActive ? styles.active : styles.navLink}>
                            Cài đặt các loại
                        </NavLink>
                    </div>
                </div>
            </nav>
            <div className={styles.userMenu}>
                <Button className="logout-button" onClick={onLogout}> Thoát</Button>
            </div>
        </header>
    );
}

export default Header;