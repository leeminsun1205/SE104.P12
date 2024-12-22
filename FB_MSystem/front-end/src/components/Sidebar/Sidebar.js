import React from 'react';
import { NavLink } from 'react-router-dom';
import styles from './Sidebar.module.css';

function Sidebar({isOpen, onToggleSidebar}) {
  return (
    <>
      {isOpen && <div className={styles.overlay} onClick={onToggleSidebar}></div>}
      <aside className={`${styles.sidebar} ${isOpen ? styles.active : ''}`}>
        <div className={styles.logo}>
          <h2>Football Management</h2>
        </div>
        <nav className={styles.nav}>
          <NavLink
            to="/dashboard"
            className={({ isActive }) =>
              isActive ? `${styles.navLink} ${styles.active}` : styles.navLink
            }
          >
            <i className="fas fa-tachometer-alt"></i> Dashboard
          </NavLink>
          <NavLink
            to="/teams"
            className={({ isActive }) =>
              isActive ? `${styles.navLink} ${styles.active}` : styles.navLink
            }
          >
            <i className="fas fa-users"></i> Teams
          </NavLink>
          <NavLink
            to="/matches"
            className={({ isActive }) =>
              isActive ? `${styles.navLink} ${styles.active}` : styles.navLink
            }
          >
            <i className="fas fa-futbol"></i> Matches
          </NavLink>
          <NavLink
            to="/standings"
            className={({ isActive }) =>
              isActive ? `${styles.navLink} ${styles.active}` : styles.navLink
            }
          >
            <i className="fas fa-list-ol"></i> Standings
          </NavLink>
          <NavLink
            to="/create/team"
            className={({ isActive }) =>
              isActive ? `${styles.navLink} ${styles.active}` : styles.navLink
            }
          >
            <i className="fas fa-users"></i> Create Team
          </NavLink>
          <NavLink
            to="/create"
            className={({ isActive }) =>
              isActive ? `${styles.navLink} ${styles.active}` : styles.navLink
            }
          >
            <i className="fas fa-users"></i> Create Team
          </NavLink>
        </nav>
      </aside>
    </>
  );
}

export default Sidebar;