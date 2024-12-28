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
                <Link to="/">Quản lý Giải Bóng đá Quốc gia</Link>
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
                        <NavLink to="/mua-giai" className={({ isActive }) => isActive ? styles.active : styles.navLink}>
                            Mùa giải
                        </NavLink>
                        <NavLink to="/doi-bong" className={({ isActive }) => isActive ? styles.active : styles.navLink}>
                            Đội bóng
                        </NavLink>
                        <NavLink to="/san-thi-dau" className={({ isActive }) => isActive ? styles.active : styles.navLink}>
                            Sân thi đấu
                        </NavLink>
                        <NavLink to="/cau-thu" className={({ isActive }) => isActive ? styles.active : styles.navLink}>
                           Cầu thủ
                        </NavLink>
                        <NavLink to="/tran-dau" className={({ isActive }) => isActive ? styles.active : styles.navLink}>
                            Trận đấu
                        </NavLink>
                        <NavLink to="/danh-sach" className={({ isActive }) => isActive ? styles.active : styles.navLink}>
                            Danh sách
                        </NavLink>
                        <NavLink to="/tao-moi" className={({ isActive }) => isActive ? styles.active : styles.navLink}>
                            Thêm mới
                        </NavLink>
                        <NavLink to="/bien-nhan" className={({ isActive }) => isActive ? styles.active : styles.navLink}>
                            Biên nhận lệ phí
                        </NavLink>
                        <NavLink to="/tra-cuu" className={({ isActive }) => isActive ? styles.active : styles.navLink}>
                            Tra cứu
                        </NavLink>
                    </div>
                 </div>
                 <div className={styles.dropdown}>
                    <button className={styles.dropbtn} onClick={toggleSettingsDropdown}>
                        Cài đặt <i className="fa fa-caret-down"></i>
                    </button>
                    <div className={`${styles.dropdownContent} ${showSettingsDropdown ? styles.show : ''}`}>
                        <NavLink to="/cai-dat/chung" className={({ isActive }) => isActive ? styles.active : styles.navLink}>
                            Cài đặt chung
                        </NavLink>
                        <NavLink to="/cai-dat/cac-loai" className={({ isActive }) => isActive ? styles.active : styles.navLink}>
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