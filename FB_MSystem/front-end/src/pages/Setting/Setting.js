import React, { useState } from 'react';
import styles from './Setting.module.css'; // Bạn cần tạo CSS cho các phần tử bên dưới

function Setting() {
    const [teamSettings, setTeamSettings] = useState({
        minPlayers: 15,  // Số cầu thủ tối thiểu
        maxPlayers: 22,  // Số cầu thủ tối đa
        maxForeignPlayers: 3,  // Số cầu thủ ngoại tối đa
        minAge: 16,  // Tuổi thi đấu tối thiểu
        maxAge: 40,   // Tuổi thi đấu tối đa
        minCapacity: 10000, // Sức chứa tối thiểu sân đấu
        minStar: 2, // Đạt chuẩn sao tối thiểu
        participationFee: 1000000000, // Lệ phí tham gia (QĐ1.3)
        winPoints: 3, // Điểm khi thắng (QĐ5.1)
        drawPoints: 1, // Điểm khi hòa (QĐ5.1)
        losePoints: 0, // Điểm khi thua (QĐ5.1)
        goalTypes: 3, // Số loại bàn thắng (QĐ3)
        maxGoalTime: 90, // Thời điểm ghi bàn tối đa (QĐ3)
        priorityOrder: ['Điểm số', 'Hiệu số', 'Số bàn thắng'], // Thứ tự ưu tiên khi xếp hạng (QĐ5.1)
    });

    const handleChangeTeamSettings = (e) => {
        const { name, value } = e.target;
        setTeamSettings({ ...teamSettings, [name]: value });
    };

    const handlePriorityOrderChange = (index, value) => {
        const newPriorityOrder = [...teamSettings.priorityOrder];
        
        // Cập nhật phần tử hiện tại
        newPriorityOrder[index] = value;

        // Kiểm tra xem có phần tử trùng với giá trị mới không
        newPriorityOrder.forEach((item, i) => {
            if (item === value && i !== index) {
                newPriorityOrder[i] = getNewValue(value, newPriorityOrder);
            }
        });

        setTeamSettings({
            ...teamSettings,
            priorityOrder: newPriorityOrder,
        });
    };

    // Hàm lấy giá trị mới thay thế nếu giá trị trùng
    const getNewValue = (currentValue, priorityOrder) => {
        const allValues = ['Điểm số', 'Hiệu số', 'Số bàn thắng'];
    
        // Lọc các giá trị còn lại trong mảng mà không trùng với currentValue
        const availableValues = allValues.filter(val => !priorityOrder.includes(val) && val !== currentValue);
    
        return availableValues[0]; // Trả về giá trị thay thế đầu tiên
    };
  
    return (
        <div className="setting-container">
            <h1>Cài Đặt Giải Đấu</h1>

            <h2>Các quy định đội bóng</h2>
            <div className="team-settings">
                <div className="setting-group">
                    <label>Số cầu thủ tối thiểu của 1 đội</label>
                    <input
                        type="number"
                        name="minPlayers"
                        value={teamSettings.minPlayers}
                        onChange={handleChangeTeamSettings}
                    />
                </div>

                <div className="setting-group">
                    <label>Số cầu thủ tối đa của 1 đội</label>
                    <input
                        type="number"
                        name="maxPlayers"
                        value={teamSettings.maxPlayers}
                        onChange={handleChangeTeamSettings}
                    />
                </div>

                <div className="setting-group">
                    <label>Số cầu thủ ngoại tối đa</label>
                    <input
                        type="number"
                        name="maxForeignPlayers"
                        value={teamSettings.maxForeignPlayers}
                        onChange={handleChangeTeamSettings}
                    />
                </div>

                <div className="setting-group">
                    <label>Tuổi thi đấu tối thiểu</label>
                    <input
                        type="number"
                        name="minAge"
                        value={teamSettings.minAge}
                        onChange={handleChangeTeamSettings}
                    /> tuổi
                </div>

                <div className="setting-group">
                    <label>Tuổi thi đấu tối đa</label>
                    <input
                        type="number"
                        name="maxAge"
                        value={teamSettings.maxAge}
                        onChange={handleChangeTeamSettings}
                    /> tuổi
                </div>

                <div className="setting-group">
                    <label>Sức chứa tối thiểu sân đấu</label>
                    <input
                        type="number"
                        name="minCapacity"
                        value={teamSettings.minCapacity}
                        onChange={handleChangeTeamSettings}
                    /> người
                </div>

                <div className="setting-group">
                    <label>Số sao đạt chuẩn tối thiểu</label>
                    <input
                        type="number"
                        name="minStar"
                        value={teamSettings.minStar}
                        onChange={handleChangeTeamSettings}
                    /> sao
                </div>

                <div className="setting-group">
                    <label>Lệ phí tham gia</label>
                    <input
                        type="number"
                        name="participationFee"
                        value={teamSettings.participationFee}
                        onChange={handleChangeTeamSettings}
                    /> VND
                </div>
            </div>

            <h2>Quy định về trận đấu</h2>
            <div className="match-settings">
                <div className="setting-group">
                    <label>Số loại bàn thắng</label>
                    <input
                        type="number"
                        name="goalTypes"
                        value={teamSettings.goalTypes}
                        onChange={handleChangeTeamSettings}
                    />
                </div>

                <div className="setting-group">
                    <label>Thời điểm ghi bàn tối đa</label>
                    <input
                        type="number"
                        name="maxGoalTime"
                        value={teamSettings.maxGoalTime}
                        onChange={handleChangeTeamSettings}
                    /> phút
                </div>
            </div>

            <h2>Quy định về điểm số</h2>
            <div className="points-settings">
                <div className="setting-group">
                    <label>Điểm khi thắng</label>
                    <input
                        type="number"
                        name="winPoints"
                        value={teamSettings.winPoints}
                        onChange={handleChangeTeamSettings}
                    />
                </div>

                <div className="setting-group">
                    <label>Điểm khi hòa</label>
                    <input
                        type="number"
                        name="drawPoints"
                        value={teamSettings.drawPoints}
                        onChange={handleChangeTeamSettings}
                    />
                </div>

                <div className="setting-group">
                    <label>Điểm khi thua</label>
                    <input
                        type="number"
                        name="losePoints"
                        value={teamSettings.losePoints}
                        onChange={handleChangeTeamSettings}
                    />
                </div>
            </div>

            <h2>Thứ tự ưu tiên khi xếp hạng</h2>
            <div className="ranking-priority">
                {teamSettings.priorityOrder.map((priority, index) => (
                    <div key={index} className="setting-group">
                        <label>Ưu tiên {index + 1}</label>
                        <select
                            value={priority}
                            onChange={(e) => handlePriorityOrderChange(index, e.target.value)}
                        >
                            <option value="Điểm số">Điểm số</option>
                            <option value="Hiệu số">Hiệu số</option>
                            <option value="Số bàn thắng">Số bàn thắng</option>
                        </select>
                    </div>
                ))}
            </div>

            <button className="save-button">Lưu</button>
        </div>
    );
}

export default Setting;
