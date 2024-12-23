// src/components/Header/Header.js
import React, { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import styles from './Header.module.css';
import Button from '../Button/Button';

function Header({ onLogout, onToggleSidebar }) {
    const [showDropdown, setShowDropdown] = useState(false);

    const toggleDropdown = () => {
        setShowDropdown(!showDropdown);
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
                    <button className={styles.dropbtn} onClick={toggleDropdown}>
                        Quản lý giải đấu <i className="fa fa-caret-down"></i>
                    </button>
                    <div className={`${styles.dropdownContent} ${showDropdown ? styles.show : ''}`}>
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
            </nav>

            <div className={styles.userMenu}>
                <Button className="logout-button" onClick={onLogout}> Thoát</Button>
            </div>
        </header>
    );
}

export default Header;