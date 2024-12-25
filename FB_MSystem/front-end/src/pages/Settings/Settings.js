import React, { useState, useEffect } from 'react';
import styles from './Settings.module.css';

function Setting({ API_URL }) {
    const [teamSettings, setTeamSettings] = useState({
        minPlayers: 15,
        maxPlayers: 22,
        maxForeignPlayers: 3,
        minAge: 16,
        maxAge: 40,
        minCapacity: 10000,
        minStar: 2,
        participationFee: 1000000000,
        winPoints: 3,
        drawPoints: 1,
        losePoints: 0,
        maxGoalTime: 90,
    });
    const [saveStatus, setSaveStatus] = useState(null); // 'success', 'error', null

    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const response = await fetch(`${API_URL}/settings`);
                if (!response.ok) {
                    throw new Error(`Failed to fetch settings. HTTP status: ${response.status}`);
                }
                const data = await response.json();
                setTeamSettings(data);
            } catch (error) {
                console.error("Error fetching settings:", error);
            }
        };

        fetchSettings();
    }, [API_URL]);

    const handleChangeTeamSettings = (e) => {
        const { name, value } = e.target;
        setTeamSettings({ ...teamSettings, [name]: value });
    };

    const handlePriorityOrderChange = (index, value) => {
        const newPriorityOrder = [...teamSettings.priorityOrder];
        newPriorityOrder[index] = value;

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

    const getNewValue = (currentValue, priorityOrder) => {
        const allValues = ['Điểm số', 'Hiệu số', 'Số bàn thắng'];
        const availableValues = allValues.filter(val => !priorityOrder.includes(val) && val !== currentValue);
        return availableValues[0];
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaveStatus('loading');

        try {
            const response = await fetch(`${API_URL}/settings`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(teamSettings),
            });

            if (!response.ok) {
                throw new Error(`Failed to save settings. HTTP status: ${response.status}`);
            }

            setSaveStatus('success');
            // Optionally, you can handle the response data if the server sends any back
            // const data = await response.json();
            // console.log("Settings saved successfully:", data);
        } catch (error) {
            console.error("Error saving settings:", error);
            setSaveStatus('error');
        }
    };

    return (
        <div className={styles["setting-container"]}>
            <h1>Cài Đặt Giải Đấu</h1>
            <form onSubmit={handleSubmit}>
                <h2>Các quy định đội bóng</h2>
                <div className={styles["team-settings"]}>
                    <div className={styles["setting-group"]}>
                        <label>Số cầu thủ tối thiểu của 1 đội</label>
                        <input
                            type="number"
                            name="minPlayers"
                            value={teamSettings.minPlayers}
                            onChange={handleChangeTeamSettings}
                        />
                    </div>

                    <div className={styles["setting-group"]}>
                        <label>Số cầu thủ tối đa của 1 đội</label>
                        <input
                            type="number"
                            name="maxPlayers"
                            value={teamSettings.maxPlayers}
                            onChange={handleChangeTeamSettings}
                        />
                    </div>

                    <div className={styles["setting-group"]}>
                        <label>Số cầu thủ ngoại tối đa</label>
                        <input
                            type="number"
                            name="maxForeignPlayers"
                            value={teamSettings.maxForeignPlayers}
                            onChange={handleChangeTeamSettings}
                        />
                    </div>

                    <div className={styles["setting-group"]}>
                        <label>Tuổi thi đấu tối thiểu</label>
                        <input
                            type="number"
                            name="minAge"
                            value={teamSettings.minAge}
                            onChange={handleChangeTeamSettings}
                        /> tuổi
                    </div>

                    <div className={styles["setting-group"]}>
                        <label>Tuổi thi đấu tối đa</label>
                        <input
                            type="number"
                            name="maxAge"
                            value={teamSettings.maxAge}
                            onChange={handleChangeTeamSettings}
                        /> tuổi
                    </div>

                    <div className={styles["setting-group"]}>
                        <label>Sức chứa tối thiểu sân đấu</label>
                        <input
                            type="number"
                            name="minCapacity"
                            value={teamSettings.minCapacity}
                            onChange={handleChangeTeamSettings}
                        /> người
                    </div>

                    <div className={styles["setting-group"]}>
                        <label>Số sao đạt chuẩn tối thiểu</label>
                        <input
                            type="number"
                            name="minStar"
                            value={teamSettings.minStar}
                            onChange={handleChangeTeamSettings}
                        /> sao
                    </div>

                    <div className={styles["setting-group"]}>
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
                <div className={styles["match-settings"]}>
                    <div className={styles["setting-group"]}>
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
                <div className={styles["points-settings"]}>
                    <div className={styles["setting-group"]}>
                        <label>Điểm khi thắng</label>
                        <input
                            type="number"
                            name="winPoints"
                            value={teamSettings.winPoints}
                            onChange={handleChangeTeamSettings}
                        />
                    </div>

                    <div className={styles["setting-group"]}>
                        <label>Điểm khi hòa</label>
                        <input
                            type="number"
                            name="drawPoints"
                            value={teamSettings.drawPoints}
                            onChange={handleChangeTeamSettings}
                        />
                    </div>

                    <div className={styles["setting-group"]}>
                        <label>Điểm khi thua</label>
                        <input
                            type="number"
                            name="losePoints"
                            value={teamSettings.losePoints}
                            onChange={handleChangeTeamSettings}
                        />
                    </div>
                </div>
                <button type="submit" className={styles["save-button"]} disabled={saveStatus === 'loading'}>
                    {saveStatus === 'loading' ? 'Đang lưu...' : 'Lưu'}
                </button>

                {saveStatus === 'success' && (
                    <p style={{ color: 'green' }}>Cài đặt đã được lưu thành công!</p>
                )}
                {saveStatus === 'error' && (
                    <p style={{ color: 'red' }}>Có lỗi xảy ra khi lưu cài đặt.</p>
                )}
            </form>
        </div>
    );
}
export default Setting;