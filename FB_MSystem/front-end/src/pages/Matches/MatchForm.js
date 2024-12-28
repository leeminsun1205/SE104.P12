
import React, { useState, useEffect } from "react";
import styles from "./MatchForm.module.css";

function MatchForm({ match: initialMatch, onSave, onCancel, API_URL, players }) {
  const [editedMatch, setEditedMatch] = useState(initialMatch);

  useEffect(() => {
    setEditedMatch(initialMatch);
  }, [initialMatch]);

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
          name="DoiBongNha"
          value={editedMatch?.DoiBongNha?.TenDoiBong || ""}
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
          name="DoiBongKhach"
          value={editedMatch?.DoiBongKhach?.TenDoiBong || ""}
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
          name="BanThangDoiNha"
          value={editedMatch?.BanThangDoiNha || 0}
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
          name="BanThangDoiKhach"
          value={editedMatch?.BanThangDoiKhach || 0}
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
          name="NgayThiDau"
          value={editedMatch?.NgayThiDau || ""}
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
          name="GioThiDau"
          value={editedMatch?.GioThiDau || ""}
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
          name="SanThiDau"
          value={editedMatch?.SanThiDau?.TenSan || ""}
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