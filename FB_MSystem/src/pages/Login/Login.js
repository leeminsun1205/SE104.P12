import React, { useState } from 'react';
import Swal from 'sweetalert2';
import styles from './Login.module.css';
import backgroundImage from '../../assets/images/hinh-nen-san-bong-dep-banner.jpg';
import showPasswordIcon from '../../assets/icons/show-password-icon.png'; // Add your path
import hidePasswordIcon from '../../assets/icons/hide-password-icon.png'; // Add your path


function Login({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false); // State to manage password visibility

  const handleSubmit = (e) => {
    e.preventDefault();

    if ((email === 'admin@example.com' && password === 'password123')
      || (email === 'admin' && password === '123')
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
        text: 'Email hoặc mật khẩu không hợp lệ!',
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
        <h2 className={styles.title}>Phần mềm <br />Quản lý giải bóng đá</h2>
        <p className={styles.subtitle}>Vui lòng đăng nhập để tiếp tục</p>
        <form onSubmit={handleSubmit}>
          <div className={styles.inputGroup}>
            <label htmlFor="email">
              Email <span className={styles.required}>*</span>
            </label>
            <input
              // type="email"
              type = "text" // For debug
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
            <div className={styles.passwordWrapper}>
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Nhập mật khẩu"
                required
              />
              <span
                className={styles.togglePassword}
                onClick={() => setShowPassword((prev) => !prev)}
              >
                <img
                  src={showPassword ? showPasswordIcon : hidePasswordIcon}
                  alt={showPassword ? "Hide password" : "Show password"}
                  className={styles.passwordIcon}
                />
              </span>
            </div>
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
