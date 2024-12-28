// pages/Settings/TypesSettings.js
import React, { useState, useEffect } from 'react';
import styles from './TypesSettings.module.css';

function TypesSettings({ API_URL }) {
    const [goalTypes, setGoalTypes] = useState([]);
    const [cardTypes, setCardTypes] = useState([]);
    const [priorityOptions, setPriorityOptions] = useState([]);
    const [saveStatus, setSaveStatus] = useState(null);

    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const response = await fetch(`${API_URL}/settings/types`);
                if (response.ok) {
                    const data = await response.json();
                    console.log(data);
                    setGoalTypes(data.settings.LoaiBanThang ? data.settings.LoaiBanThang.map(gt => ({ ...gt, MaLoaiBanThang: gt.MaLoaiBanThang })) : []);
                    setCardTypes(data.settings.LoaiThePhat ? data.settings.LoaiThePhat.map(ct => ({ ...ct, MaLoaiThePhat: ct.MaLoaiThePhat })) : []);

                    const loaiUuTienData = data.settings.LoaiUuTien || [];
                    const utXepHangData = data.settings.Ut_XepHang || [];

                    const loaiUuTienMap = new Map(loaiUuTienData.map(item => [item.MaLoaiUuTien, item.TenLoaiUuTien]));
                    const utXepHangMap = new Map(utXepHangData.map(item => [item.MaLoaiUuTien, item.MucDoUuTien]));

                    const mappedPriorityOptions = Array.from(utXepHangMap.keys()).map(maLoaiUuTien => ({
                        code: maLoaiUuTien,
                        name: loaiUuTienMap.get(maLoaiUuTien) || 'N/A',
                        priorityLevel: utXepHangMap.get(maLoaiUuTien),
                    }));

                    setPriorityOptions(mappedPriorityOptions);

                }
            } catch (error) {
                console.error("Error fetching types settings:", error);
            }
        };

        fetchSettings();
    }, [API_URL]);

    const generateGoalTypeCode = () => {
        if (!goalTypes || goalTypes.length === 0) {
            return 'LBT01';
        }
        const lastCode = goalTypes.slice().sort((a, b) => b.MaLoaiBanThang.localeCompare(a.MaLoaiBanThang))[0].MaLoaiBanThang;
        const number = parseInt(lastCode.slice(3), 10) + 1;
        return `LBT${number.toString().padStart(2, '0')}`;
    };

    const generateCardTypeCode = () => {
        if (!cardTypes || cardTypes.length === 0) {
            return 'LTP01';
        }
        const lastCode = cardTypes.slice().sort((a, b) => b.MaLoaiThePhat.localeCompare(a.MaLoaiThePhat))[0].MaLoaiThePhat;
        const number = parseInt(lastCode.slice(3), 10) + 1;
        return `LTP${number.toString().padStart(2, '0')}`;
    };

    // Goal Types Handlers
    const handleGoalTypeChange = (MaLoaiBanThang, field, value) => {
        const newGoalTypes = goalTypes.map(goalType =>
            goalType.MaLoaiBanThang === MaLoaiBanThang
                ? { ...goalType, [field]: value }
                : goalType
        );
        setGoalTypes(newGoalTypes);
    };

    const addGoalType = () => {
        setGoalTypes([...goalTypes, { MaLoaiBanThang: generateGoalTypeCode(), TenLoaiBanThang: '', MoTa: '' }]);
    };

    const removeGoalType = (MaLoaiBanThang) => {
        const newGoalTypes = goalTypes.filter(goalType => goalType.MaLoaiBanThang !== MaLoaiBanThang);
        setGoalTypes(newGoalTypes);
    };

    // Card Types Handlers
    const handleCardTypeChange = (MaLoaiThePhat, field, value) => {
        const newCardTypes = cardTypes.map(cardType =>
            cardType.MaLoaiThePhat === MaLoaiThePhat ? { ...cardType, [field]: value } : cardType
        );
        setCardTypes(newCardTypes);
    };

    const addCardType = () => {
        setCardTypes([...cardTypes, { MaLoaiThePhat: generateCardTypeCode(), TenLoaiThePhat: '', MoTa: '' }]);
    };

    const removeCardType = (MaLoaiThePhat) => {
        const newCardTypes = cardTypes.filter(cardType => cardType.MaLoaiThePhat !== MaLoaiThePhat);
        setCardTypes(newCardTypes);
    };

    // Ranking Priority Handlers
    const handlePriorityOptionChange = (index, field, value) => {
        const newPriorityOptions = [...priorityOptions];
        newPriorityOptions[index][field] = value;
        setPriorityOptions(newPriorityOptions);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaveStatus('loading');

        const sortedPriorityOptions = [...priorityOptions].sort((a, b) => a.priorityLevel - b.priorityLevel);

        const settingsData = {
            LoaiBanThang: goalTypes,
            LoaiThePhat: cardTypes,
            MaLoaiUuTien: sortedPriorityOptions.map(option => ({
                MaLoaiUuTien: option.code,
                TenLoaiUuTien: option.name,
                MucDoUuTien: option.priorityLevel,
            })),
            Ut_XepHang: sortedPriorityOptions.map(option => ({
                MaLoaiUuTien: option.code,
                MucDoUuTien: option.priorityLevel,
            })),
        };

        try {
            const response = await fetch(`${API_URL}/settings/types`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(settingsData),
            });

            if (!response.ok) {
                throw new Error(`Failed to save types settings. HTTP status: ${response.status}`);
            }

            setSaveStatus('success');
        } catch (error) {
            console.error("Error saving types settings:", error);
            setSaveStatus('error');
        }
    };

    return (
        <div className={styles["types-settings-container"]}>
            <h1>Cài Đặt Các Loại</h1>
            <form onSubmit={handleSubmit}>
                <div className={styles["settings-row"]}>
                    <div className={styles["setting-section-small"]}>
                        <h2>Loại Bàn Thắng</h2>
                        <table className={styles["settings-table"]}>
                            <thead>
                                <tr>
                                    <th>Mã</th>
                                    <th>Tên</th>
                                    <th>Mô tả</th>
                                    <th>Hành động</th>
                                </tr>
                            </thead>
                            <tbody>
                                {goalTypes.map((goalType) => (
                                    <tr key={goalType.MaLoaiBanThang}>
                                        <td>
                                            <input
                                                type="text"
                                                value={goalType.MaLoaiBanThang}
                                                readOnly
                                            />
                                        </td>
                                        <td>
                                            <input
                                                type="text"
                                                value={goalType.TenLoaiBanThang}
                                                onChange={(e) => handleGoalTypeChange(goalType.MaLoaiBanThang, 'TenLoaiBanThang', e.target.value)}
                                            />
                                        </td>
                                        <td>
                                            <textarea
                                                value={goalType.MoTa}
                                                onChange={(e) => handleGoalTypeChange(goalType.MaLoaiBanThang, 'MoTa', e.target.value)}
                                            />
                                        </td>
                                        <td>
                                            <button style={{ backgroundColor: '#dc3545', color: 'white' }} type="button" onClick={() => removeGoalType(goalType.MaLoaiBanThang)}>Xóa</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        <button type="button" onClick={addGoalType}>Thêm loại bàn thắng</button>
                    </div>

                    <div className={styles["setting-section-small"]}>
                        <h2>Loại Thẻ Phạt</h2>
                        <table className={styles["settings-table"]}>
                            <thead>
                                <tr>
                                    <th>Mã</th>
                                    <th>Tên</th>
                                    <th>Mô tả</th>
                                    <th>Hành động</th>
                                </tr>
                            </thead>
                            <tbody>
                                {cardTypes.map((cardType) => (
                                    <tr key={cardType.MaLoaiThePhat}>
                                        <td>
                                            <input
                                                type="text"
                                                value={cardType.MaLoaiThePhat}
                                                readOnly
                                            />
                                        </td>
                                        <td>
                                            <input
                                                type="text"
                                                value={cardType.TenLoaiThePhat}
                                                onChange={(e) => handleCardTypeChange(cardType.MaLoaiThePhat, 'TenLoaiThePhat', e.target.value)}
                                            />
                                        </td>
                                        <td>
                                            <textarea
                                                value={cardType.MoTa}
                                                onChange={(e) => handleCardTypeChange(cardType.MaLoaiThePhat, 'MoTa', e.target.value)}
                                            />
                                        </td>
                                        <td>
                                            <button style={{ backgroundColor: '#dc3545', color: 'white' }} type="button" onClick={() => removeCardType(cardType.MaLoaiThePhat)}>Xóa</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        <button type="button" onClick={addCardType}>Thêm loại thẻ phạt</button>
                    </div>
                </div>

                <div className={styles["setting-section"]}>
                    <h2>Thứ Tự Ưu Tiên Khi Xếp Hạng</h2>
                    <table className={styles["settings-table"]}>
                        <thead>
                            <tr>
                                <th>Mã</th>
                                <th>Tên loại ưu tiên</th>
                                <th>Mức độ ưu tiên</th>
                            </tr>
                        </thead>
                        <tbody>
                            {priorityOptions.sort((a, b) => a.priorityLevel - b.priorityLevel).map((option, index) => (
                                <tr key={option.code}>
                                    <td>
                                        <input
                                            type="text"
                                            value={option.code}
                                            readOnly
                                        />
                                    </td>
                                    <td>
                                        <input
                                            type="text"
                                            value={option.name}
                                            onChange={(e) => handlePriorityOptionChange(index, 'name', e.target.value)}
                                        />
                                    </td>
                                    <td>
                                        <input
                                            type="number"
                                            value={option.priorityLevel}
                                            onChange={(e) => {
                                                const newPriorityLevel = parseInt(e.target.value, 10);
                                                if (!isNaN(newPriorityLevel)) {
                                                    handlePriorityOptionChange(index, 'priorityLevel', newPriorityLevel);
                                                }
                                            }}
                                        />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
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

export default TypesSettings;