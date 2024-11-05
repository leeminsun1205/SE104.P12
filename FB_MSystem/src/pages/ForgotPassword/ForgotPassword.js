// src/pages/ForgotPassword/ForgotPassword.js
import React, { useState } from 'react';
import styles from './ForgotPassword.module.css';

function ForgotPassword() {
  const [email, setEmail] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // Thực hiện logic gửi email để đặt lại mật khẩu
    alert('Link đặt lại mật khẩu đã được gửi đến email của bạn!');
  };

  return (
    <div className={styles.forgotPasswordContainer}>
      <div className={styles.forgotPasswordBox}>
        <h2 className={styles.title}>Quên Mật Khẩu</h2>
        <p className={styles.subtitle}>Nhập email để nhận link đặt lại mật khẩu</p>
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
          <button type="submit" className={styles.submitButton}>Gửi Link</button>
        </form>
      </div>
    </div>
  );
}

export default ForgotPassword;
