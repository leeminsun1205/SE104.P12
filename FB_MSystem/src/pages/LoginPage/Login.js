// src/pages/LoginPage/Login.js
import React, { useState } from 'react';
import styles from './Login.module.css';
import backgroundImage from '../../assets/images/hinh-nen-san-bong-dep-banner.jpg';

function Login({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // Gọi hàm đăng nhập từ props
    onLogin();
  };

  return (
    <div 
      className={styles.loginContainer} 
      style={{ backgroundImage: `url(${backgroundImage})` }}
    >
      <div className={styles.loginBox}>
        <h2 className={styles.title}>Welcome Back!</h2>
        <p className={styles.subtitle}>Please sign in to continue</p>
        <form onSubmit={handleSubmit}>
          <div className={styles.inputGroup}>
            <label htmlFor="email">Email</label>
            <input 
              type="email" 
              id="email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              placeholder="Enter your email"
              required 
            />
          </div>
          <div className={styles.inputGroup}>
            <label htmlFor="password">Password</label>
            <input 
              type="password" 
              id="password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              placeholder="Enter your password"
              required 
            />
          </div>
          <button type="submit" className={styles.loginButton}>Login</button>
        </form>
        <div className={styles.footer}>
          <a href="/forgot-password" className={styles.forgotPassword}>Forgot Password?</a>
          <p>Don't have an account? <a href="/signup">Sign Up</a></p>
        </div>
      </div>
    </div>
  );
}

export default Login;
