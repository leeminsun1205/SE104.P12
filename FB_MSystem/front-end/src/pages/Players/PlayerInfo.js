import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import styles from "./PlayerInfo.module.css";
import { calculateAge } from "./PlayerList";

const PlayerInfo = ({ API_URL }) => {
  const { MaDoiBong, MaCauThu } = useParams();
  const navigate = useNavigate();
  const [player, setPlayer] = useState(null); // Initialize as null
  const [error, setError] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [editedPlayer, setEditedPlayer] = useState({});

  useEffect(() => {
    const fetchPlayerFromAPI = async () => {
      try {
        let url = "";
        if (MaDoiBong) {
          url = `${API_URL}/db-ct/doi-bong/${MaDoiBong}/cau-thu/${MaCauThu}`;
        } else {
          url = `${API_URL}/cau-thu/${MaCauThu}`;
        }
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error("Player not found");
        }
        let data = await response.json();
        if (MaDoiBong) {
          data = data.cauThu[0]; // Assuming the relevant player data is the first element
        }
        setPlayer(data);
        setEditedPlayer(data); // Initialize editedPlayer with fetched data
      } catch (err) {
        setError(err.message);
      }
    };

    fetchPlayerFromAPI();
  }, [API_URL, MaDoiBong, MaCauThu]);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditedPlayer(player); // Revert changes
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedPlayer(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSave = async () => {
    try {
      const response = await fetch(`${API_URL}/cau-thu/${MaCauThu}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(editedPlayer),
      });

      if (!response.ok) {
        throw new Error("Failed to update player information");
      }

      const updatedPlayer = await response.json();
      setPlayer(updatedPlayer);
      setIsEditing(false);
    } catch (error) {
      setError(error.message);
    }
  };

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

      {isEditing ? (
        <div className={styles["player-details"]}>
          <p>
            <strong>Mã cầu thủ:</strong> {player.MaCauThu}
          </p>
          <div>
            <label><strong>Tên:</strong></label>
            <input type="text" name="TenCauThu" value={editedPlayer.TenCauThu || ""} onChange={handleInputChange} />
          </div>
          <div>
            <label><strong>Năm sinh:</strong></label>
            <input type="date" name="NgaySinh" value={editedPlayer.NgaySinh ? editedPlayer.NgaySinh.substring(0, 10) : ""} onChange={handleInputChange} />
          </div>
          <p>
            <strong>Tuổi:</strong> {calculateAge(editedPlayer.NgaySinh)}
          </p>
          <div>
            <label><strong>Vị trí:</strong></label>
            <input type="text" name="ViTri" value={editedPlayer.ViTri || ""} onChange={handleInputChange} />
          </div>
          <div>
            <label><strong>Quốc tịch:</strong></label>
            <input type="text" name="QuocTich" value={editedPlayer.QuocTich || ""} onChange={handleInputChange} />
          </div>
          <div>
            <label><strong>Chiều cao (cm):</strong></label>
            <input type="number" name="ChieuCao" value={editedPlayer.ChieuCao || ""} onChange={handleInputChange} />
          </div>
          <div>
            <label><strong>Cân nặng (kg):</strong></label>
            <input type="number" name="CanNang" value={editedPlayer.CanNang || ""} onChange={handleInputChange} />
          </div>
          <div>
            <label><strong>Tiểu sử:</strong></label>
            <textarea name="TieuSu" value={editedPlayer.TieuSu || ""} onChange={handleInputChange} />
          </div>
          <p>
            <strong>Loại cầu thủ:</strong> {editedPlayer.LoaiCauThu === 1 ? "Trong nước" : "Nước ngoài"}
          </p>
          <div className={styles["edit-buttons"]}>
            <button onClick={handleSave} className={styles["save-button"]}>Lưu</button>
            <button onClick={handleCancelEdit} className={styles["cancel-button"]}>Hủy</button>
          </div>
        </div>
      ) : (
        <div className={styles["player-details"]}>
          <p>
            <strong>Tên:</strong> {player.TenCauThu}
          </p>
          <p>
            <strong>Năm sinh:</strong> {player.NgaySinh}
          </p>
          <p>
            <strong>Tuổi:</strong> {calculateAge(player.NgaySinh)}
          </p>
          <p>
            <strong>Vị trí:</strong> {player.ViTri}
          </p>
          <p>
            <strong>Số áo:</strong> {player.SoAo}
          </p>
          <p>
            <strong>Quốc tịch:</strong> {player.QuocTich}
          </p>
          <p>
            <strong>Chiều cao:</strong> {player.ChieuCao} cm
          </p>
          <p>
            <strong>Cân nặng:</strong> {player.CanNang} kg
          </p>
          <p>
            <strong>Tiểu sử:</strong> {player.TieuSu}
          </p>
          <p>
            <strong>Loại cầu thủ:</strong> {player.LoaiCauThu === 1 ? "Trong nước" : "Nước ngoài"}
          </p>
          <button onClick={handleEdit} className={styles["edit-button"]}>Sửa thông tin</button>
        </div>
      )}
    </div>
  );
};

export default PlayerInfo;