// src/components/Button/Button.js
import React from 'react';
import styles from './Button.module.css';
import PropTypes from 'prop-types';

function Button({ type = 'button', size = 'medium', variant = 'primary', disabled = false, loading = false, onClick, children }) {
  const buttonClasses = `
    ${styles.button} 
    ${styles[size]} 
    ${styles[variant]} 
    ${loading ? styles.loading : ''} 
  `;

  return (
    <button 
      type={type} 
      className={buttonClasses} 
      disabled={disabled || loading} 
      onClick={onClick}
    >
      {loading ? <span className={styles.spinner}></span> : children}
    </button>
  );
}

// Định nghĩa các kiểu dữ liệu cho các props của Button
Button.propTypes = {
  type: PropTypes.oneOf(['button', 'submit', 'reset']),
  size: PropTypes.oneOf(['small', 'medium', 'large']),
  variant: PropTypes.oneOf(['primary', 'secondary', 'outline']),
  disabled: PropTypes.bool,
  loading: PropTypes.bool,
  onClick: PropTypes.func,
  children: PropTypes.node.isRequired,
};

export default Button;
