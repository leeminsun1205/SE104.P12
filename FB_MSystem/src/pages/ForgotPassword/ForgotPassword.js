import React, { useState } from 'react';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import styles from './ForgotPassword.module.css';
import backgroundImage from '../../assets/images/hinh-nen-san-bong-dep-banner.jpg';

function ForgotPassword() {
  const [email, setEmail] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      Swal.fire({
        title: 'Lỗi',
        text: 'Email không hợp lệ!',
        icon: 'error',
        confirmButtonText: 'Thử lại',
      });
      return;
    }

    Swal.fire({
      title: 'Thành công',
      text: 'Link đặt lại mật khẩu đã được gửi đến email của bạn!',
      icon: 'success',
      confirmButtonText: 'OK',
    });
  };

  return (
    <div
      className={styles.forgotPasswordContainer}
      style={{ backgroundImage: `url(${backgroundImage})` }}
    >
      <div className={styles.forgotPasswordBox}>
        <h2 className={styles.title}>Quên Mật Khẩu</h2>
        <p className={styles.subtitle}>Nhập email để nhận link đặt lại mật khẩu</p>
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
          <button type="submit" className={styles.submitButton}>
            Xác nhận
          </button>
        </form>
        <button
          className={styles.goBackButton}
          onClick={() => navigate('/login')}
        >
          Quay lại
        </button>
      </div>
    </div>
  );
}

export default ForgotPassword;
