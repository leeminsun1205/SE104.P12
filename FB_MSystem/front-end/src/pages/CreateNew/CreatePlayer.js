import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./CreatePlayer.css";

function CreatePlayer({ onAddPlayer, seasons }) {
  const navigate = useNavigate();
  const [player, setPlayer] = useState({
    name: "",
    dob: "",
    nationality: "",
    position: "",
    season: "",
    birthplace: "",
    height: null,
    weight: null,
    bio: "",
  });
  const [error, setError] = useState("");

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setPlayer((prev) => ({ ...prev, [name]: value }));
  };

  const handleAdd = async () => {
    setError("");

    if (!player.name.trim() || !player.position || !player.nationality.trim() || !player.dob) {
        setError("Vui lòng điền đầy đủ thông tin.");
        return;
    }

    const newPlayer = {
        ...player,
        id: Date.now(),
        height: player.height ? parseInt(player.height, 10) : null,
        weight: player.weight ? parseInt(player.weight, 10) : null,
    };

    console.log("New Player to Add:", newPlayer);

    try {
        await onAddPlayer(newPlayer);
        alert("Đã thêm cầu thủ thành công!");
        navigate("/create");
    } catch (error) {
        console.error("Error adding player:", error);
        setError("Failed to add player.");
    }
    navigate("/create")
};

  const handleSubmit = (event) => {
    event.preventDefault();
    handleAdd();
  };

  const resetForm = () => {
    setPlayer({
      name: "",
      dob: "",
      nationality: "",
      position: "",
      season: "",
      birthplace: "",
      height: null,
      weight: null,
      bio: "",
    });
  };

  return (
    <div className="form-container">
      <h2>Thêm cầu thủ</h2>
      {error && <p className="error-message">{error}</p>}
      {[
        { name: "name", label: "Họ tên", type: "text", required: true },
        { name: "dob", label: "Ngày sinh", type: "date", required: true},
        { name: "nationality", label: "Quốc tịch", type: "text", required: true },
        { name: "birthplace", label: "Nơi sinh", type: "text" },
      ].map((input) => (
        <div key={input.name}>
          <label htmlFor={input.name}>
            {input.label} {input.required && <span style={{ color: "red" }}>*</span>}
          </label>
          <input
            type={input.type}
            name={input.name}
            id={input.name}
            value={player[input.name] || ""}
            onChange={handleInputChange}
            required={input.required}
          />
        </div>
      ))}
      <div>
        <label htmlFor="position">Vị trí thi đấu <span style={{ color: "red" }}>*</span></label>
        <select
          id="position"
          name="position"
          value={player.position}
          onChange={handleInputChange}
        >
          <option value="">Lựa chọn vị trí thi đấu</option>
          <option value="Tiền đạo">Tiền đạo</option>
          <option value="Tiền vệ">Tiền vệ</option>
          <option value="Hậu vệ">Hậu vệ</option>
          <option value="Thủ môn">Thủ môn</option>
        </select>
      </div>
      {[
        { name: "height", label: "Chiều cao (cm)", type: "number" },
        { name: "weight", label: "Cân nặng (kg)", type: "number" },
      ].map((input) => (
        <div key={input.name}>
          <label htmlFor={input.name}>{input.label}</label>
          <input
            type={input.type}
            name={input.name}
            id={input.name}
            value={player[input.name] || ""}
            onChange={handleInputChange}
          />
        </div>
      ))}
      <div>
        <label htmlFor="bio">Tiểu sử:</label>
        <textarea
          id="bio"
          name="bio"
          value={player.bio}
          onChange={handleInputChange}
        />
      </div>
      <div className="create-container">
        <button className="add" type="submit" onClick={handleSubmit}>
          Tạo thông tin
        </button>
        <button className="cancel" type="button" onClick={() => navigate(`/create`)}>
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