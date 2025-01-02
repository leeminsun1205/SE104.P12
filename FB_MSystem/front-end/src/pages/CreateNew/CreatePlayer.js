import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./CreatePlayer.css";

function CreatePlayer({ API_URL, onAddPlayer, onClose }) {
  const navigate = useNavigate();
  const [player, setPlayer] = useState({
    TenCauThu: "",
    NgaySinh: "",
    QuocTich: "",
    ViTri: "",
    SoAo: "",
    ChieuCao: "",
    CanNang: "",
    TieuSu: "",
    LoaiCauThu: "",
  });
  const [errors, setErrors] = useState({});

  const handleInputChange = (event) => {
    const { name, value } = event.target;

    // Kiểm tra và ngăn chặn nhập số âm cho Số áo, Chiều cao, Cân nặng
    if (name === "SoAo" || name === "ChieuCao" || name === "CanNang") {
      const parsedValue = parseFloat(value);
      if (parsedValue < 1) {
        return; // Không cập nhật state nếu giá trị âm
      }
    }

    setPlayer((prev) => ({ ...prev, [name]: value }));
    setErrors((prevErrors) => ({ ...prevErrors, [name]: "" }));
  };

  useEffect(() => {
    const checkQuocTich = () => {
      const quocTich = player.QuocTich.toLowerCase();
      if (quocTich === "việt nam" || quocTich === "viet nam" || quocTich === "vn") {
        setPlayer(prev => ({ ...prev, LoaiCauThu: "Trong nước" }));
      } else if (player.QuocTich.trim() !== "") {
        setPlayer(prev => ({ ...prev, LoaiCauThu: "Ngoài nước" }));
      } else {
        setPlayer(prev => ({ ...prev, LoaiCauThu: "" }));
      }
    };

    checkQuocTich();
  }, [player.QuocTich]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    let isValid = true;
    const newErrors = {};

    if (!player.TenCauThu.trim()) {
      newErrors.TenCauThu = "Tên cầu thủ không được để trống";
      isValid = false;
    }
    if (!player.ViTri) {
      newErrors.ViTri = "Vị trí thi đấu không được để trống";
      isValid = false;
    }
    if (!player.QuocTich.trim()) {
      newErrors.QuocTich = "Quốc tịch không được để trống";
      isValid = false;
    }
    if (!player.NgaySinh) {
      newErrors.NgaySinh = "Ngày tháng năm sinh không được để trống";
      isValid = false;
    }

    setErrors(newErrors);

    if (isValid) {
      const newPlayer = {
        ...player,
        SoAo: player.SoAo === "" ? null : parseInt(player.SoAo),
        ChieuCao: player.ChieuCao === "" ? null : player.ChieuCao,
        CanNang: player.CanNang === "" ? null : player.CanNang,
      };

      try {
        const response = await fetch(`${API_URL}/cau-thu`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(newPlayer),
        });

        if (response.ok) {
          alert("Đã thêm cầu thủ thành công!");
          navigate("/tao-moi");
        } else {
          const errorData = await response.json();
          console.error("Failed to add player:", errorData);
          setErrors(errorData.message || "Failed to add player.");
        }
      } catch (error) {
        console.error("Error adding player:", error);
        setErrors({ general: "Có lỗi xảy ra khi thêm cầu thủ." });
      }
    }
  };

  const resetForm = () => {
    setPlayer({
      TenCauThu: "",
      NgaySinh: "",
      QuocTich: "",
      ViTri: "",
      SoAo: "",
      ChieuCao: "",
      CanNang: "",
      TieuSu: "",
      LoaiCauThu: "",
    });
    setErrors({});
  };

  return (
    <div className="form-container">
      <h2>Thêm cầu thủ</h2>
      {errors.general && <p className="error-message">{errors.general}</p>}
      <div>
        <label htmlFor="name">
          Họ tên <span style={{ color: "red" }}>*</span>
        </label>
        <input
          type="text"
          name="TenCauThu"
          id="TenCauThu"
          value={player.TenCauThu}
          onChange={handleInputChange}
        />
        {errors.TenCauThu && <p className="error-message">{errors.TenCauThu}</p>}
      </div>
      <div>
        <label htmlFor="NgaySinh">
          Ngày sinh <span style={{ color: "red" }}>*</span>
        </label>
        <input
          type="date"
          name="NgaySinh"
          id="NgaySinh"
          value={player.NgaySinh}
          onChange={handleInputChange}
        />
        {errors.NgaySinh && <p className="error-message">{errors.NgaySinh}</p>}
      </div>
      <div>
        <label htmlFor="QuocTich">
          Quốc tịch <span style={{ color: "red" }}>*</span>
        </label>
        <input
          type="text"
          name="QuocTich"
          id="QuocTich"
          value={player.QuocTich}
          onChange={handleInputChange}
        />
        {errors.QuocTich && <p className="error-message">{errors.QuocTich}</p>}
      </div>
      <div>
        <label htmlFor="SoAo">Số áo</label>
        <input
          type="number"
          name="SoAo"
          id="SoAo"
          value={player.SoAo}
          onChange={handleInputChange}
        />
        {errors.SoAo && <p className="error-message">{errors.SoAo}</p>}
      </div>
      <div>
        <label htmlFor="ViTri">
          Vị trí thi đấu <span style={{ color: "red" }}>*</span>
        </label>
        <select
          id="ViTri"
          name="ViTri"
          value={player.ViTri}
          onChange={handleInputChange}
        >
          <option value="">Lựa chọn vị trí thi đấu</option>
          <option value="Tiền đạo">Tiền đạo</option>
          <option value="Tiền vệ">Tiền vệ</option>
          <option value="Hậu vệ">Hậu vệ</option>
          <option value="Thủ môn">Thủ môn</option>
        </select>
        {errors.ViTri && <p className="error-message">{errors.ViTri}</p>}
      </div>
      <div>
        <label htmlFor="LoaiCauThu">
          Loại cầu thủ
        </label>
        <input
          type="text"
          id="LoaiCauThu"
          name="LoaiCauThu"
          value={player.LoaiCauThu}
          readOnly
        />
      </div>
      <div>
        <label htmlFor="ChieuCao">Chiều cao (m)</label>
        <input
          type="number"
          name="ChieuCao"
          id="ChieuCao"
          value={player.ChieuCao}
          onChange={handleInputChange}
          step="any"
        />
        {errors.ChieuCao && <p className="error-message">{errors.ChieuCao}</p>}
      </div>
      <div>
        <label htmlFor="CanNang">Cân nặng (kg)</label>
        <input
          type="number"
          name="CanNang"
          id="CanNang"
          value={player.CanNang}
          onChange={handleInputChange}
          step="any"
        />
        {errors.CanNang && <p className="error-message">{errors.CanNang}</p>}
      </div>
      <div>
        <label htmlFor="TieuSu">Tiểu sử:</label>
        <textarea
          id="TieuSu"
          name="TieuSu"
          value={player.TieuSu}
          onChange={handleInputChange}
        />
      </div>
      <div className="create-container">
        <button className="add" type="button" onClick={handleSubmit}>
          Tạo thông tin
        </button>
        <button className="cancel" type="button" onClick={() => navigate(`/tao-moi`)}>
          Hủy
        </button>
        <button className="reset" type="button" onClick={resetForm}>
          Xóa
        </button>
      </div>
    </div>
  );
}

export default CreatePlayer;