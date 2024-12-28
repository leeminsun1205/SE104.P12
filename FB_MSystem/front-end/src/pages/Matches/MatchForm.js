import React, { useState, useEffect } from "react";
import styles from "./MatchForm.module.css";

function MatchForm({ match: initialMatch, onSave, onCancel, API_URL, players, availableTeams, availableStadiums }) {
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
        <select
          className={styles.input}
          id="MaDoiBongNha"
          name="MaDoiBongNha"
          value={editedMatch?.MaDoiBongNha || ""}
          disabled // Added disabled attribute
        >
          <option value="">Chọn đội nhà</option>
          {availableTeams.map((team) => (
            <option key={team.MaDoiBong} value={team.MaDoiBong}>
              {team.TenDoiBong}
            </option>
          ))}
        </select>
      </div>
      <div className={styles.formGroup}>
        <label className={styles.label} htmlFor="awayTeam">
          Đội khách:
        </label>
        <select
          className={styles.input}
          id="MaDoiBongKhach"
          name="MaDoiBongKhach"
          value={editedMatch?.MaDoiBongKhach || ""}
          disabled // Added disabled attribute
        >
          <option value="">Chọn đội khách</option>
          {availableTeams.map((team) => (
            <option key={team.MaDoiBong} value={team.MaDoiBong}>
              {team.TenDoiBong}
            </option>
          ))}
        </select>
      </div>
      <div className={styles.formGroup}>
        <label className={styles.label} htmlFor="stadium">
          Sân vận động:
        </label>
        <select
          className={styles.input}
          id="stadium"
          name="MaSan"
          value={editedMatch?.MaSan || ""}
          onChange={handleInputChange}
        >
          <option value="">Chọn sân vận động</option>
          {availableStadiums.map((stadium) => (
            <option key={stadium.MaSan} value={stadium.MaSan}>
              {stadium.TenSan}
            </option>
          ))}
        </select>
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

      <div className={styles.buttonGroup}>
        <button className={styles.saveButton} type="submit">
          Lưu Thay Đổi
        </button>
        <button type="button" className={styles.cancelButton} onClick={onCancel}>
          Hủy
        </button>
      </div>
    </form>
  );
}

export default MatchForm;