// src/pages/SignUp/SignUp.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './SignUp.module.css';

function SignUp() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert('Mật khẩu không khớp!');
      return;
    }
    // Thực hiện logic đăng ký người dùng
    alert('Đăng ký thành công!');
    navigate('/login'); // Chuyển hướng về trang đăng nhập
  };

  return (
    <div className={styles.signUpContainer}>
      <div className={styles.signUpBox}>
        <h2 className={styles.title}>Đăng Ký Tài Khoản</h2>
        <form onSubmit={handleSubmit}>
          <div className={styles.inputGroup}>
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Nhập email của bạn"
              required
            />
          </div>
          <div className={styles.inputGroup}>
            <label htmlFor="password">Mật Khẩu</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Nhập mật khẩu"
              required
            />
          </div>
          <div className={styles.inputGroup}>
            <label htmlFor="confirmPassword">Xác Nhận Mật Khẩu</label>
            <input
              type="password"
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Xác nhận mật khẩu"
              required
            />
          </div>
          <button type="submit" className={styles.submitButton}>Đăng Ký</button>
        </form>
      </div>
    </div>
  );
}

export default SignUp;
