import React, { useState, useEffect } from "react";
import styles from "./MatchForm.module.css";

function MatchForm({ match: initialMatch, onSave, onCancel, API_URL }) {
  const [editedMatch, setEditedMatch] = useState(initialMatch);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setEditedMatch((prevMatch) => ({
      ...prevMatch,
      [name]: value,
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    onSave(editedMatch);
  };

  return (
    <form className={styles.formContainer} onSubmit={handleSubmit}>
      <div className={styles.formGroup}>
        <label className={styles.label} htmlFor="homeTeam">
          Đội nhà:
        </label>
        <input
          className={styles.input}
          type="text"
          id="homeTeam"
          name="homeTeamName"
          value={editedMatch?.homeTeamName || ""}
          readOnly
        />
      </div>
      <div className={styles.formGroup}>
        <label className={styles.label} htmlFor="awayTeam">
          Đội khách:
        </label>
        <input
          className={styles.input}
          type="text"
          id="awayTeam"
          name="awayTeamName"
          value={editedMatch?.awayTeamName || ""}
          readOnly
        />
      </div>
      <div className={styles.formGroup}>
        <label className={styles.label} htmlFor="homeScore">
          Bàn thắng đội nhà:
        </label>
        <input
          className={styles.input}
          type="number"
          id="homeScore"
          name="homeScore"
          value={editedMatch?.homeScore || 0}
          onChange={handleInputChange}
        />
      </div>
      <div className={styles.formGroup}>
        <label className={styles.label} htmlFor="awayScore">
          Bàn thắng đội khách:
        </label>
        <input
          className={styles.input}
          type="number"
          id="awayScore"
          name="awayScore"
          value={editedMatch?.awayScore || 0}
          onChange={handleInputChange}
        />
      </div>
      <div className={styles.formGroup}>
        <label className={styles.label} htmlFor="date">
          Ngày:
        </label>
        <input
          className={styles.input}
          type="date"
          id="date"
          name="date"
          value={editedMatch?.date || ""}
          onChange={handleInputChange}
        />
      </div>
      <div className={styles.formGroup}>
        <label className={styles.label} htmlFor="time">
          Giờ:
        </label>
        <input
          className={styles.input}
          type="time"
          id="time"
          name="time"
          value={editedMatch?.time || ""}
          onChange={handleInputChange}
        />
      </div>
      <div className={styles.formGroup}>
        <label className={styles.label} htmlFor="stadium">
          Sân vận động:
        </label>
        <input
          className={styles.input}
          type="text"
          id="stadium"
          name="stadiumName"
          value={editedMatch?.stadiumName || ""}
          readOnly
        />
      </div>

      <div className={styles.buttonGroup}>
        <button className={styles.saveButton} type="submit">
          Lưu
        </button>
        <button className={styles.cancelButton} type="button" onClick={onCancel}>
          Hủy
        </button>
      </div>
    </form>
  );
}

export default MatchForm;