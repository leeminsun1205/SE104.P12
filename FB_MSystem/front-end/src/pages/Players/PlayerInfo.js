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
          let url = ''
          if (MaDoiBong) {
            url = `${API_URL}/db-ct/doi-bong/${MaDoiBong}/cau-thu/${MaCauThu}`
          }
          else {
            url = `${API_URL}/cau-thu/${MaCauThu}`;
          }
          const response = await fetch(url);
          if (!response.ok) {
            throw new Error("Player not found");
          }
          let data = await response.json();
          if (MaDoiBong) {
            data = data.cauThu
          }
          console.log(data)
          setPlayer(data);
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
          <strong>Tên:</strong> {MaDoiBong ? player[0].TenCauThu : player.TenCauThu}
        </p>
        <p>
          <strong>Năm sinh:</strong> {MaDoiBong ? player[0].NgaySinh : player.NgaySinh}
        </p>
        <p>
          <strong>Tuổi:</strong> {MaDoiBong ? calculateAge(player[0].NgaySinh) :  calculateAge(player.NgaySinh)}
        </p>
        <p>
          <strong>Vị trí:</strong> {MaDoiBong ? player[0].ViTri : player.ViTri}
        </p>
        <p>
          <strong>Quốc tịch:</strong> {MaDoiBong ? player[0].QuocTich : player.QuocTich}
        </p>
        <p>
          <strong>Chiều cao:</strong> {MaDoiBong ? player[0].ChieuCao : player.ChieuCao} cm
        </p>
        <p>
          <strong>Cân nặng:</strong> {MaDoiBong ? player[0].CanNang : player.CanNang} kg
        </p>
        <p>
          <strong>Tiểu sử:</strong> {MaDoiBong ? player[0].TieuSu : player.TieuSu}
        </p>
        <p>
          <strong>Loại cầu thủ:</strong> {(MaDoiBong ? player[0].LoaiCauThu : player.LoaiCauThu) ? "Trong nước" : "Nước ngoài"}
        </p>
      </div>
    </div>
  );
};

export default PlayerInfo;