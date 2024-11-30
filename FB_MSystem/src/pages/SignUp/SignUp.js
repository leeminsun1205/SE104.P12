import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import styles from './SignUp.module.css';
import backgroundImage from '../../assets/images/hinh-nen-san-bong-dep-banner.jpg';

function SignUp() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    // Regular expression to validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      Swal.fire({
        title: 'Lỗi',
        text: 'Email không hợp lệ!',
        icon: 'error',
        confirmButtonText: 'OK',
      });
      return;
    }

    if (password !== confirmPassword) {
      Swal.fire({
        title: 'Lỗi',
        text: 'Mật khẩu không khớp!',
        icon: 'error',
        confirmButtonText: 'OK',
      });
      return;
    }

    Swal.fire({
      title: 'Đăng ký thành công!',
      text: 'Tài khoản của bạn đã được tạo. Hãy đăng nhập để tiếp tục.',
      icon: 'success',
      confirmButtonText: 'OK',
    }).then(() => {
      navigate('/login'); 
    });
  };

  return (
    <div
      className={styles.signUpContainer}
      style={{ backgroundImage: `url(${backgroundImage})` }}
    >
      <div className={styles.signUpBox}>
        <h2 className={styles.title}>Đăng Ký Tài Khoản</h2>
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
              placeholder="Nhập email của bạn"
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
          <div className={styles.inputGroup}>
            <label htmlFor="confirmPassword">
            Xác nhận mật khẩu<span className={styles.required}>*</span>
            </label>
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
        <button
          className={styles.goBackButton}
          onClick={() => navigate('/login')}
        >
          Quay lại
        </button>      </div>
    </div>
  );
}

export default SignUp;
