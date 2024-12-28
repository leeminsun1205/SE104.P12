import React, { useState, useEffect } from 'react';
import styles from './Settings.module.css';

function Setting({ API_URL }) {
    const [teamSettings, setTeamSettings] = useState({});
    const [saveStatus, setSaveStatus] = useState(null); // 'success', 'error', null

    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const response = await fetch(`${API_URL}/tham-so`);
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
        let newValue = value;

        if (name !== "LePhi") {
            const parsedValue = parseInt(value, 10);
            if (!isNaN(parsedValue) && parsedValue >= 0) {
                if (name === "TieuChuanToiThieu" && (parsedValue < 1 || parsedValue > 5)) {
                    return; // Don't update if outside the 1-5 range
                }
                newValue = parsedValue;
            } else if (value === "") {
                newValue = ""; // Allow clearing the input
            } else if (value === "0") {
                newValue = 0; // Explicitly handle "0"
            } else {
                return; // Don't update if not a non-negative number
            }
        } else {
            const parsedValue = parseInt(value, 10);
            if (!isNaN(parsedValue) && parsedValue >= 0) {
                newValue = parsedValue;
            } else if (value === "") {
                newValue = "";
            } else if (value === "0") {
                newValue = 0;
            } else {
                return;
            }
        }

        setTeamSettings({ ...teamSettings, [name]: newValue });
    };

    const handleChangeLePhi = (e) => {
        const { value } = e.target;
        const parsedValue = parseInt(value, 10);

        if (!isNaN(parsedValue) && parsedValue >= 0) {
            setTeamSettings(prevSettings => ({
                ...prevSettings,
                LePhi: parsedValue,
            }));
        } else if (value === "") {
            setTeamSettings(prevSettings => ({
                ...prevSettings,
                LePhi: "",
            }));
        } else if (value === "0") {
            setTeamSettings(prevSettings => ({
                ...prevSettings,
                LePhi: 0,
            }));
        }
    };

    const handleBlurLePhi = (e) => {
        const { value } = e.target;
        const parsedValue = parseInt(value, 10);
        if (!isNaN(parsedValue) && parsedValue >= 0) {
            const roundedValue = Math.ceil(parsedValue / 1000000) * 1000000;
            setTeamSettings(prevSettings => ({
                ...prevSettings,
                LePhi: roundedValue,
            }));
        } else if (value === "0") {
            setTeamSettings(prevSettings => ({
                ...prevSettings,
                LePhi: 0,
            }));
        } else if (value !== "") {
            // Revert to previous valid value if input is invalid and not empty
            setTeamSettings(prevSettings => ({
                ...prevSettings,
                LePhi: prevSettings.LePhi || 0, // Revert to 0 if no previous valid value
            }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaveStatus('loading');

        try {
            const response = await fetch(`${API_URL}/tham-so`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(teamSettings),
            });
            const responseData = await response.json();
            if (!response.ok) {
                throw new Error(`Failed to save settings. HTTP status: ${response.status}`);
            }

            setSaveStatus('success');
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
                            name="SoLuongCauThuToiThieu"
                            value={teamSettings.SoLuongCauThuToiThieu === 0 ? '0' : teamSettings.SoLuongCauThuToiThieu || ''}
                            onChange={handleChangeTeamSettings}
                            min="0"
                        />
                    </div>

                    <div className={styles["setting-group"]}>
                        <label>Số cầu thủ tối đa của 1 đội</label>
                        <input
                            type="number"
                            name="SoLuongCauThuToiDa"
                            value={teamSettings.SoLuongCauThuToiDa === 0 ? '0' : teamSettings.SoLuongCauThuToiDa || ''}
                            onChange={handleChangeTeamSettings}
                            min="0"
                        />
                    </div>

                    <div className={styles["setting-group"]}>
                        <label>Số cầu thủ ngoại tối đa</label>
                        <input
                            type="number"
                            name="SoCauThuNgoaiToiDa"
                            value={teamSettings.SoCauThuNgoaiToiDa === 0 ? '0' : teamSettings.SoCauThuNgoaiToiDa || ''}
                            onChange={handleChangeTeamSettings}
                            min="0"
                        />
                    </div>

                    <div className={styles["setting-group"]}>
                        <label>Tuổi thi đấu tối thiểu</label>
                        <input
                            type="number"
                            name="TuoiToiThieu"
                            value={teamSettings.TuoiToiThieu === 0 ? '0' : teamSettings.TuoiToiThieu || ''}
                            onChange={handleChangeTeamSettings}
                            min="0"
                        /> tuổi
                    </div>

                    <div className={styles["setting-group"]}>
                        <label>Tuổi thi đấu tối đa</label>
                        <input
                            type="number"
                            name="TuoiToiDa"
                            value={teamSettings.TuoiToiDa === 0 ? '0' : teamSettings.TuoiToiDa || ''}
                            onChange={handleChangeTeamSettings}
                            min="0"
                        /> tuổi
                    </div>

                    <div className={styles["setting-group"]}>
                        <label>Sức chứa tối thiểu sân đấu</label>
                        <input
                            type="number"
                            name="SucChuaToiThieu"
                            value={teamSettings.SucChuaToiThieu === 0 ? '0' : teamSettings.SucChuaToiThieu || ''}
                            onChange={handleChangeTeamSettings}
                            min="0"
                        /> người
                    </div>

                    <div className={styles["setting-group"]}>
                        <label>Số sao đạt chuẩn tối thiểu</label>
                        <input
                            type="number"
                            name="TieuChuanToiThieu"
                            value={teamSettings.TieuChuanToiThieu === 0 ? '0' : teamSettings.TieuChuanToiThieu || ''}
                            onChange={handleChangeTeamSettings}
                            min="1"
                            max="5"
                        /> sao
                    </div>

                    <div className={styles["setting-group"]}>
                        <label>Lệ phí tham gia</label>
                        <input
                            type="number"
                            name="LePhi"
                            value={teamSettings.LePhi === 0 ? '0' : teamSettings.LePhi || ''}
                            onChange={handleChangeLePhi}
                            onBlur={handleBlurLePhi}
                            min="0"
                        />
                        <span>VND</span>
                    </div>
                </div>

                <h2>Quy định về trận đấu</h2>
                <div className={styles["match-settings"]}>
                    <div className={styles["setting-group"]}>
                        <label>Thời điểm ghi bàn tối đa</label>
                        <input
                            type="number"
                            name="ThoiDiemGhiBanToiDa"
                            value={teamSettings.ThoiDiemGhiBanToiDa === 0 ? '0' : teamSettings.ThoiDiemGhiBanToiDa || ''}
                            onChange={handleChangeTeamSettings}
                            min="0"
                        /> phút
                    </div>
                </div>

                <h2>Quy định về điểm số</h2>
                <div className={styles["points-settings"]}>
                    <div className={styles["setting-group"]}>
                        <label>Điểm khi thắng</label>
                        <input
                            type="number"
                            name="DiemThang"
                            value={teamSettings.DiemThang === 0 ? '0' : teamSettings.DiemThang || ''}
                            onChange={handleChangeTeamSettings}
                            min="0"
                        />
                    </div>

                    <div className={styles["setting-group"]}>
                        <label>Điểm khi hòa</label>
                        <input
                            type="number"
                            name="DiemHoa"
                            value={teamSettings.DiemHoa === 0 ? '0' : teamSettings.DiemHoa || ''}
                            onChange={handleChangeTeamSettings}
                            min="0"
                        />
                    </div>

                    <div className={styles["setting-group"]}>
                        <label>Điểm khi thua</label>
                        <input
                            type="number"
                            name="DiemThua"
                            value={teamSettings.DiemThua === 0 ? '0' : teamSettings.DiemThua || ''}
                            onChange={handleChangeTeamSettings}
                            min="0"
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