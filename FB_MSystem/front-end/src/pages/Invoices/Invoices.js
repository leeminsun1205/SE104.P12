// src/pages/Invoices/Invoices.js
import React from 'react';
import styles from './Invoices.module.css';

function Invoices() {
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className={styles.invoicePage}>
      <h1>Biên nhận lệ phí</h1>
      <div className={styles.invoiceContent}>
        <div className={styles.invoiceSection}>
          <p>
            <span className={styles.label}>Tên đội bóng:</span>
            <span className={styles.value}>..........................................................................................................</span>
          </p>
          <p>
            <span className={styles.label}>Lệ phí:</span>
            <span className={styles.value}>..........................................................................................................</span>
          </p>
          <p>
            <span className={styles.label}>Đã nhận:</span>
            <span className={styles.value}>..........................................................................................................</span>
          </p>
          <p>
            <span className={styles.label}>Ngày nhận:</span>
            <span className={styles.value}>..........................................................................................................</span>
          </p>
          <p>
            <span className={styles.label}>Tình trạng:</span>
            <span className={styles.value}>..........................................................................................................</span>
          </p>
        </div>
      </div>

      <button className={styles.printButton} onClick={handlePrint}>In biên nhận</button>
    </div>
  );
}

export default Invoices;