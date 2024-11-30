import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import styles from './Sidebar.module.css';

function Sidebar() {
  const [sidebarOpen, setsidebarOpen] = useState(false);

  // Toggle sidebar visibility
  const toggleSidebar = () => {
    setsidebarOpen((prev) => {
      console.log('Sidebar state:', !prev); // Debugging log
      return !prev;
    });
  };

  return (
    <>
      <button
        className={`${styles.toggleButton} ${sidebarOpen ? styles.active : ''}`}
        onClick={toggleSidebar}
        aria-label="Toggle Sidebar"
      >
        ☰
      </button>
      <aside
        className={`${styles.sidebar} ${sidebarOpen ? styles.active : ''}`}
      >
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
        </nav>
      </aside>
    </>
  );
}

export default Sidebar;
