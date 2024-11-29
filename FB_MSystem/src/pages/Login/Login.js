// src/pages/LoginPage/Login.js
import React, { useState } from 'react';
import styles from './Login.module.css';
import backgroundImage from '../../assets/images/hinh-nen-san-bong-dep-banner.jpg';

function Login({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onLogin();
  };

  return (
    <div 
      className={styles.loginContainer} 
      style={{ backgroundImage: `url(${backgroundImage})` }}
    >
      <div className={styles.loginBox}>
        <h2 className={styles.title}>Welcome <br/> Football Management!</h2>
        <p className={styles.subtitle}>Vui lòng đăng nhập để tiếp tục</p>
        <form onSubmit={handleSubmit}>
          <div className={styles.inputGroup}>
            <label htmlFor="email">
              Email <span className={styles.required}>*</span>
              </label>
            <input 
              type="email" 
              id="email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              placeholder="Nhập email"
              required 
            />
          </div>
          <div className={styles.inputGroup}>
            <label htmlFor="password">
              Mật khẩu <span className={styles.required}>*</span>
            </label>
            <input 
              type="password" 
              id="password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              placeholder="Nhập mật khẩu"
              required 
            />
          </div>
          <button type="submit" className={styles.loginButton}>Login</button>
        </form>
        <div className={styles.footer}>
          <a href="/forgot-password" className={styles.forgotPassword}>Quên mật khẩu?</a>
          <p>Không có tài khoản? <a href="/signup">Đăng ký ngay</a></p>
        </div>
      </div>
    </div>
  );
}

export default Login;
