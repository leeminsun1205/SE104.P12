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
        setTeamSettings({ ...teamSettings, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaveStatus('loading');

        try {
            console.log("Dữ liệu gửi đi:", teamSettings); // Kiểm tra dữ liệu trước khi gửi

            const response = await fetch(`${API_URL}/tham-so`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(teamSettings),
            });

            console.log("Phản hồi từ server:", response.status);
            const responseData = await response.json();
            console.log("Dữ liệu phản hồi:", responseData);

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
                            name="SoLuongCauThuToiThieu" // Đã sửa
                            value={teamSettings.SoLuongCauThuToiThieu}
                            onChange={handleChangeTeamSettings}
                        />
                    </div>

                    {/* Các input khác tương tự */}
                    <div className={styles["setting-group"]}>
                        <label>Số cầu thủ tối đa của 1 đội</label>
                        <input
                            type="number"
                            name="SoLuongCauThuToiDa" // Đã sửa
                            value={teamSettings.SoLuongCauThuToiDa}
                            onChange={handleChangeTeamSettings}
                        />
                    </div>

                    <div className={styles["setting-group"]}>
                        <label>Số cầu thủ ngoại tối đa</label>
                        <input
                            type="number"
                            name="SoCauThuNgoaiToiDa" // Đã sửa
                            value={teamSettings.SoCauThuNgoaiToiDa}
                            onChange={handleChangeTeamSettings}
                        />
                    </div>

                    <div className={styles["setting-group"]}>
                        <label>Tuổi thi đấu tối thiểu</label>
                        <input
                            type="number"
                            name="TuoiToiThieu" // Đã sửa
                            value={teamSettings.TuoiToiThieu}
                            onChange={handleChangeTeamSettings}
                        /> tuổi
                    </div>

                    <div className={styles["setting-group"]}>
                        <label>Tuổi thi đấu tối đa</label>
                        <input
                            type="number"
                            name="TuoiToiDa" // Đã sửa
                            value={teamSettings.TuoiToiDa}
                            onChange={handleChangeTeamSettings}
                        /> tuổi
                    </div>

                    <div className={styles["setting-group"]}>
                        <label>Sức chứa tối thiểu sân đấu</label>
                        <input
                            type="number"
                            name="SucChuaToiThieu" // Đã sửa
                            value={teamSettings.SucChuaToiThieu}
                            onChange={handleChangeTeamSettings}
                        /> người
                    </div>

                    <div className={styles["setting-group"]}>
                        <label>Số sao đạt chuẩn tối thiểu</label>
                        <input
                            type="number"
                            name="TieuChuanToiThieu" // Đã sửa
                            value={teamSettings.TieuChuanToiThieu}
                            onChange={handleChangeTeamSettings}
                        /> sao
                    </div>

                    <div className={styles["setting-group"]}>
                        <label>Lệ phí tham gia</label>
                        <input
                            type="number"
                            name="LePhi" // Đã sửa
                            value={teamSettings.LePhi}
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
                            name="ThoiDiemGhiBanToiDa" // Đã sửa
                            value={teamSettings.ThoiDiemGhiBanToiDa}
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
                            name="DiemThang" // Đã sửa
                            value={teamSettings.DiemThang}
                            onChange={handleChangeTeamSettings}
                        />
                    </div>

                    <div className={styles["setting-group"]}>
                        <label>Điểm khi hòa</label>
                        <input
                            type="number"
                            name="DiemHoa" // Đã sửa
                            value={teamSettings.DiemHoa}
                            onChange={handleChangeTeamSettings}
                        />
                    </div>

                    <div className={styles["setting-group"]}>
                        <label>Điểm khi thua</label>
                        <input
                            type="number"
                            name="DiemThua" // Đã sửa
                            value={teamSettings.DiemThua}
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