import React, { useState } from 'react';
import Swal from 'sweetalert2';
import styles from './Login.module.css';
import backgroundImage from '../../assets/images/hinh-nen-san-bong-dep-banner.jpg';

function Login({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();

    // Example logic to simulate login
    if ((email === 'admin@example.com' && password === 'password123')
      || ( email === 'admin' && password === '123')
    ) {
      Swal.fire({
        title: 'Đăng nhập thành công',
        text: 'Chào mừng trở lại!',
        icon: 'success',
        confirmButtonText: 'Tiếp tục',
      }).then(() => {
        onLogin();
      });
    } else {
      Swal.fire({
        title: 'Đăng nhập thất bại',
        text: 'Email hoặc mật khẩu không hơp lệ!',
        icon: 'error',
        confirmButtonText: 'Thử lại',
      });
    }
  };

  return (
    <div 
      className={styles.loginContainer} 
      style={{ backgroundImage: `url(${backgroundImage})` }}
    >
      <div className={styles.loginBox}>
        <h2 className={styles.title}>Phần mềm <br></br>Quản lý giải bóng đá</h2>
        <p className={styles.subtitle}>Vui lòng đăng nhập để tiếp tục</p>
        <form onSubmit={handleSubmit}>
          <div className={styles.inputGroup}>
            <label htmlFor="email">
              Email <span className={styles.required}>*</span>
              </label>
            <input 
              type = "text" // for debug
              // type="email" 
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
          <button type="submit" className={styles.loginButton}>Đăng nhập</button>
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
