import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./CreatePlayer.css";

function CreatePlayer({ API_URL, onAddPlayer }) {
  console.log("onAddPlayer in CreatePlayer:", onAddPlayer);
  const navigate = useNavigate();
  const [player, setPlayer] = useState({
    name: "",
    dob: "",
    nationality: "",
    position: "",
    birthplace: "",
    height: "",
    weight: "",
    bio: "",
    playerType: "",
  });
  const [errors, setErrors] = useState({});

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setPlayer((prev) => ({ ...prev, [name]: value }));
    setErrors((prevErrors) => ({ ...prevErrors, [name]: "" })); 
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    let isValid = true;
    const newErrors = {};

    if (!player.name.trim()) {
      newErrors.name = "Tên cầu thủ không được để trống";
      isValid = false;
    }
    if (!player.position) {
      newErrors.position = "Vị trí thi đấu không được để trống";
      isValid = false;
    }
    if (!player.nationality.trim()) {
      newErrors.nationality = "Quốc tịch không được để trống";
      isValid = false;
    }
    if (!player.dob) {
      newErrors.dob = "Ngày tháng năm sinh không được để trống";
      isValid = false;
    }
    if (!player.playerType) {
      newErrors.playerType = "Loại cầu thủ không được để trống";
      isValid = false;
    }

    setErrors(newErrors);

    if (isValid) {
      const newPlayer = {
        ...player,
        height: player.height ? parseInt(player.height, 10) : null,
        weight: player.weight ? parseInt(player.weight, 10) : null,
      };

      console.log("New Player to Add:", newPlayer);

      try {
        const response = await fetch(`${API_URL}/players`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(newPlayer),
        });

        if (response.ok) {
          const data = await response.json();
          console.log("Player added successfully:", data.player);
          alert("Đã thêm cầu thủ thành công!");
          navigate("/create");
          // If you need to update the parent's state with the new player
          if (onAddPlayer) {
            onAddPlayer(data.player);
          }
        } else {
          const errorData = await response.json();
          console.error("Failed to add player:", errorData);
          setErrors(errorData.message || "Failed to add player.");
        }
      } catch (error) {
        console.error("Error adding player:", error);
        setErrors({ general: "Có lỗi xảy ra khi thêm cầu thủ." }); // General error
      }
    }
  };

  const resetForm = () => {
    setPlayer({
      name: "",
      dob: "",
      nationality: "",
      position: "",
      birthplace: "",
      height: "",
      weight: "",
      bio: "",
      playerType: "",
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
          name="name"
          id="name"
          value={player.name}
          onChange={handleInputChange}
        />
        {errors.name && <p className="error-message">{errors.name}</p>}
      </div>
      <div>
        <label htmlFor="dob">
          Ngày sinh <span style={{ color: "red" }}>*</span>
        </label>
        <input
          type="date"
          name="dob"
          id="dob"
          value={player.dob}
          onChange={handleInputChange}
        />
        {errors.dob && <p className="error-message">{errors.dob}</p>}
      </div>
      <div>
        <label htmlFor="nationality">
          Quốc tịch <span style={{ color: "red" }}>*</span>
        </label>
        <input
          type="text"
          name="nationality"
          id="nationality"
          value={player.nationality}
          onChange={handleInputChange}
        />
        {errors.nationality && <p className="error-message">{errors.nationality}</p>}
      </div>
      <div>
        <label htmlFor="birthplace">Nơi sinh</label>
        <input
          type="text"
          name="birthplace"
          id="birthplace"
          value={player.birthplace}
          onChange={handleInputChange}
        />
      </div>
      <div>
        <label htmlFor="position">
          Vị trí thi đấu <span style={{ color: "red" }}>*</span>
        </label>
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
        {errors.position && <p className="error-message">{errors.position}</p>}
      </div>
      <div>
        <label htmlFor="playerType">
          Loại cầu thủ <span style={{ color: "red" }}>*</span>
        </label>
        <select
          id="playerType"
          name="playerType"
          value={player.playerType}
          onChange={handleInputChange}
        >
          <option value="">Chọn loại cầu thủ</option>
          <option value="Trong nước">Trong nước</option>
          <option value="Ngoài nước">Ngoài nước</option>
        </select>
        {errors.playerType && <p className="error-message">{errors.playerType}</p>}
      </div>
      <div>
        <label htmlFor="height">Chiều cao (cm)</label>
        <input
          type="number"
          name="height"
          id="height"
          value={player.height}
          onChange={handleInputChange}
        />
      </div>
      <div>
        <label htmlFor="weight">Cân nặng (kg)</label>
        <input
          type="number"
          name="weight"
          id="weight"
          value={player.weight}
          onChange={handleInputChange}
        />
      </div>
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
        <button className="add" type="button" onClick={handleSubmit}>
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