// src/pages/Dashboard/Dashboard.js
import React from "react";
import styles from "./Dashboard.module.css";
import { Link } from "react-router-dom";

function Dashboard() {
  return (
    <div className={styles.dashboard}>
      <h2 className={styles.title}>Chào mừng đến với Trang Điều Hướng</h2>
      <div className={styles.navigationGrid}>
        {/* Nhóm Quản lý Giải Đấu */}
        <div className={styles.navigationGroup}>
          <h3>Quản lý Giải Đấu</h3>
          <Link to="/mua-giai" className={styles.navigationCard}>
            <i className="fas fa-calendar"></i>
            <span>Mùa giải</span>
          </Link>
          <Link to="/doi-bong" className={styles.navigationCard}>
            <i className="fas fa-users"></i>
            <span>Đội bóng</span>
          </Link>
          <Link to="/san-thi-dau" className={styles.navigationCard}>
            <i className="fas fa-futbol"></i>
            <span>Sân thi đấu</span>
          </Link>
          <Link to="/cau-thu" className={styles.navigationCard}>
            <i className="fas fa-user"></i>
            <span>Cầu thủ</span>
          </Link>
          <Link to="/tran-dau" className={styles.navigationCard}>
            <i className="fas fa-futbol"></i>
            <span>Trận đấu</span>
          </Link>
          <Link to="/danh-sach" className={styles.navigationCard}>
            <i className="fas fa-list-ol"></i>
            <span>Danh sách</span>
          </Link>
          <Link to="/tao-moi" className={styles.navigationCard}>
            <i className="fas fa-plus"></i>
            <span>Thêm mới</span>
          </Link>
          <Link to="/bien-nhan" className={styles.navigationCard}>
            <i className="fas fa-file-invoice"></i>
            <span>Biên nhận lệ phí</span>
          </Link>
          <Link to="/tra-cuu" className={styles.navigationCard}>
            <i className="fas fa-search"></i>
            <span>Tra cứu</span>
          </Link>
        </div>

        {/* Nhóm Cài Đặt */}
        <div className={styles.navigationGroup}>
          <h3>Cài Đặt</h3>
          <Link to="/cai-dat/chung" className={styles.navigationCard}>
            <i className="fas fa-cog"></i>
            <span>Cài đặt chung</span>
          </Link>
          <Link to="/cai-dat/cac-loai" className={styles.navigationCard}>
            <i className="fas fa-sliders-h"></i>
            <span>Cài đặt các loại</span>
          </Link>
        </div>

        {/* Bạn có thể thêm các nhóm điều hướng khác nếu cần */}
      </div>
    </div>
  );
}

export default Dashboard;