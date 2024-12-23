import React from 'react';
import './EditStadiumModal.module.css';

function EditStadiumModal({ show, onHide, children }) {
  if (!show) {
    return null;
  }

  return (
    <div className="modal-backdrop">
      <div className="modal-content">
        <button className="close-button" onClick={onHide}>
          ×
        </button>
        {children}
      </div>
    </div>
  );
}

export default EditStadiumModal;