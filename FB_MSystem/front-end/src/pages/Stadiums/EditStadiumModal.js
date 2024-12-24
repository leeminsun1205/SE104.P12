import React from 'react';
import styles from './EditStadiumModal.module.css';

function EditStadiumModal({ show, onHide, children }) {
  if (!show) {
    return null;
  }

  return (
    <div className={styles["modal-backdrop"]}>
      <div className={styles["modal-content"]}>
        <button className={styles["close-button"]} onClick={onHide}>
          ×
        </button>
        {children}
      </div>
    </div>
  );
}

export default EditStadiumModal;