import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import styles from "./PlayerInfo.module.css";
import { calculateAge } from "./PlayerList";

const PlayerInfo = ({ API_URL }) => {
  const { MaDoiBong, MaCauThu } = useParams();
  const navigate = useNavigate();
  const [player, setPlayer] = useState();
  const [error, setError] = useState("");

  useEffect(() => {
    if (!player) {
      const fetchPlayerFromAPI = async () => {
        try {
          const url = MaDoiBong
            ? `${API_URL}/db-ct/doi-bong/${MaDoiBong}/cau-thu/${MaCauThu}`
            : `${API_URL}/cau-thu/${MaCauThu}`;

          const response = await fetch(url);
          if (!response.ok) {
            throw new Error("Player not found");
          }
          const data = await response.json();
          setPlayer(data.cauThu);
        } catch (err) {
          setError(err.message);
        }
      };

      fetchPlayerFromAPI();
    }
  }, [MaDoiBong, MaCauThu, player]);

  if (error) {
    return (
      <div className={styles["player-info-container"]}>
        <h2>{error}</h2>
        <button onClick={() => navigate(-1)} className={styles["back-button"]}>
          Quay lại
        </button>
      </div>
    );
  }

  if (!player) {
    return (
      <div className={styles["player-info-container"]}>
        <h2>Đang tải thông tin cầu thủ...</h2>
        <button onClick={() => navigate(-1)} className={styles["back-button"]}>
          Quay lại
        </button>
      </div>
    );
  }
  return (
    <div className={styles["player-info-container"]}>
      <button onClick={() => navigate(-1)} className={styles["back-button"]}>
        Quay lại
      </button>
      <h2>Thông tin cầu thủ</h2>
      <div className={styles["player-details"]}>
        <p>
          <strong>Tên:</strong> {player[0].TenCauThu}
        </p>
        <p>
          <strong>Năm sinh:</strong> {player[0].NgaySinh}
        </p>
        <p>
          <strong>Tuổi:</strong> {calculateAge(player[0].NgaySinh)}
        </p>
        <p>
          <strong>Vị trí:</strong> {player[0].ViTri}
        </p>
        <p>
          <strong>Quốc tịch:</strong> {player[0].QuocTich}
        </p>
        <p>
          <strong>Chiều cao:</strong> {player[0].ChieuCao} cm
        </p>
        <p>
          <strong>Cân nặng:</strong> {player[0].CanNang} kg
        </p>
        <p>
          <strong>Tiểu sử:</strong> {player[0].TieuSu}
        </p>
        <p>
          <strong>Loại cầu thủ:</strong> {player[0].LoaiCauThu ? "Trong nước" : "Nước ngoài"}
        </p>
      </div>
    </div>
  );
};

export default PlayerInfo;