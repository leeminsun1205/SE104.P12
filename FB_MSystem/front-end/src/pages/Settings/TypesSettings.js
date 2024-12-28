// pages/Settings/TypesSettings.js
import React, { useState, useEffect } from 'react';
import styles from './TypesSettings.module.css';

function TypesSettings({ API_URL }) {
    const [goalTypes, setGoalTypes] = useState([]);
    const [cardTypes, setCardTypes] = useState([]);
    const [priorityTypes, setPriorityTypes] = useState([]); // Thêm state cho loại ưu tiên
    const [editingGoalTypeId, setEditingGoalTypeId] = useState(null);
    const [editingCardTypeId, setEditingCardTypeId] = useState(null);
    const [editingPriorityTypeId, setEditingPriorityTypeId] = useState(null); // Thêm state chỉnh sửa cho loại ưu tiên

    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const response = await fetch(`${API_URL}/settings/types`);
                if (response.ok) {
                    const data = await response.json();
                    setGoalTypes(data.settings.LoaiBanThang ? data.settings.LoaiBanThang.map(gt => ({ ...gt, MaLoaiBanThang: gt.MaLoaiBanThang })) : []);
                    setCardTypes(data.settings.LoaiThePhat ? data.settings.LoaiThePhat.map(ct => ({ ...ct, MaLoaiThePhat: ct.MaLoaiThePhat })) : []);
                    setPriorityTypes(data.settings.LoaiUuTien ? data.settings.LoaiUuTien.map(pt => ({ ...pt, MaLoaiUuTien: pt.MaLoaiUuTien })) : []); // Lấy dữ liệu loại ưu tiên
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

    const addGoalType = async () => {
        const newGoalTypeCode = generateGoalTypeCode();
        const newGoalType = { MaLoaiBanThang: newGoalTypeCode, TenLoaiBanThang: '', MoTa: '' };
        setGoalTypes([...goalTypes, newGoalType]);
        setEditingGoalTypeId(newGoalTypeCode); // Thêm dòng này
        try {
            const response = await fetch(`${API_URL}/loai-ban-thang`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newGoalType),
            });
            if (!response.ok) {
                console.error("Error adding goal type:", response);
            }
        } catch (error) {
            console.error("Error adding goal type:", error);
        }
    };

    const removeGoalType = (MaLoaiBanThang) => {
        const newGoalTypes = goalTypes.filter(goalType => goalType.MaLoaiBanThang !== MaLoaiBanThang);
        setGoalTypes(newGoalTypes);
    };

    const handleDeleteGoalType = async (MaLoaiBanThang) => {
        try {
            const response = await fetch(`${API_URL}/loai-ban-thang/${MaLoaiBanThang}`, {
                method: 'DELETE',
            });
            if (!response.ok) {
                console.error("Error deleting goal type:", response);
            } else {
                const updatedGoalTypes = goalTypes.filter(gt => gt.MaLoaiBanThang !== MaLoaiBanThang);
                setGoalTypes(updatedGoalTypes);
            }
        } catch (error) {
            console.error("Error deleting goal type:", error);
        }
    };

    const handleEditGoalType = (MaLoaiBanThang) => {
        setEditingGoalTypeId(MaLoaiBanThang);
    };

    const handleSaveEditGoalType = async (MaLoaiBanThang) => {
        setEditingGoalTypeId(null);
        const goalTypeToUpdate = goalTypes.find(gt => gt.MaLoaiBanThang === MaLoaiBanThang);
        if (goalTypeToUpdate) {
            try {
                const response = await fetch(`${API_URL}/loai-ban-thang/${MaLoaiBanThang}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(goalTypeToUpdate),
                });
                if (!response.ok) {
                    console.error("Error updating goal type:", response);
                } else {
                    const updatedGoalTypes = goalTypes.map(gt =>
                        gt.MaLoaiBanThang === MaLoaiBanThang ? goalTypeToUpdate : gt
                    );
                    setGoalTypes(updatedGoalTypes);
                }
            } catch (error) {
                console.error("Error updating goal type:", error);
            }
        }
    };

    const handleCancelEditGoalType = (MaLoaiBanThang) => {
        setEditingGoalTypeId(null);
    };

    // Card Types Handlers
    const handleCardTypeChange = (MaLoaiThePhat, field, value) => {
        const newCardTypes = cardTypes.map(cardType =>
            cardType.MaLoaiThePhat === MaLoaiThePhat ? { ...cardType, [field]: value } : cardType
        );
        setCardTypes(newCardTypes);
    };

    const addCardType = async () => {
        const newCardTypeCode = generateCardTypeCode();
        const newCardType = { MaLoaiThePhat: newCardTypeCode, TenLoaiThePhat: '', MoTa: '' };
        setCardTypes([...cardTypes, newCardType]);
        setEditingCardTypeId(newCardTypeCode); // Thêm dòng này
        try {
            const response = await fetch(`${API_URL}/loai-the-phat`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newCardType),
            });
            if (!response.ok) {
                console.error("Error adding card type:", response);
            }
        } catch (error) {
            console.error("Error adding card type:", error);
        }
    };

    const removeCardType = (MaLoaiThePhat) => {
        const newCardTypes = cardTypes.filter(cardType => cardType.MaLoaiThePhat !== MaLoaiThePhat);
        setCardTypes(newCardTypes);
    };

    const handleDeleteCardType = async (MaLoaiThePhat) => {
        try {
            const response = await fetch(`${API_URL}/loai-the-phat/${MaLoaiThePhat}`, {
                method: 'DELETE',
            });
            if (!response.ok) {
                console.error("Error deleting card type:", response);
            } else {
                const updatedCardTypes = cardTypes.filter(ct => ct.MaLoaiThePhat !== MaLoaiThePhat);
                setCardTypes(updatedCardTypes);
            }
        } catch (error) {
            console.error("Error deleting card type:", error);
        }
    };

    const handleEditCardType = (MaLoaiThePhat) => {
        setEditingCardTypeId(MaLoaiThePhat);
    };

    const handleSaveEditCardType = async (MaLoaiThePhat) => {
        setEditingCardTypeId(null);
        const cardTypeToUpdate = cardTypes.find(ct => ct.MaLoaiThePhat === MaLoaiThePhat);
        if (cardTypeToUpdate) {
            try {
                const response = await fetch(`${API_URL}/loai-the-phat/${MaLoaiThePhat}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(cardTypeToUpdate),
                });
                if (!response.ok) {
                    console.error("Error updating card type:", response);
                } else {
                    const updatedCardTypes = cardTypes.map(ct =>
                        ct.MaLoaiThePhat === MaLoaiThePhat ? cardTypeToUpdate : ct
                    );
                    setCardTypes(updatedCardTypes);
                }
            } catch (error) {
                console.error("Error updating card type:", error);
            }
        }
    };

    const handleCancelEditCardType = (MaLoaiThePhat) => {
        setEditingCardTypeId(null);
    };

    // Priority Types Handlers
    const handlePriorityTypeChange = (MaLoaiUuTien, field, value) => {
        const newPriorityTypes = priorityTypes.map(priorityType =>
            priorityType.MaLoaiUuTien === MaLoaiUuTien ? { ...priorityType, [field]: value } : priorityType
        );
        setPriorityTypes(newPriorityTypes);
    };

    const handleEditPriorityType = (MaLoaiUuTien) => {
        setEditingPriorityTypeId(MaLoaiUuTien);
    };

    const handleSaveEditPriorityType = async (MaLoaiUuTien) => {
        setEditingPriorityTypeId(null);
        const priorityTypeToUpdate = priorityTypes.find(pt => pt.MaLoaiUuTien === MaLoaiUuTien);
        if (priorityTypeToUpdate) {
            try {
                const response = await fetch(`${API_URL}/loai-uu-tien/${MaLoaiUuTien}`, { // Đảm bảo API endpoint này đúng
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(priorityTypeToUpdate),
                });
                if (!response.ok) {
                    console.error("Error updating priority type:", response);
                } else {
                    const updatedPriorityTypes = priorityTypes.map(pt =>
                        pt.MaLoaiUuTien === MaLoaiUuTien ? priorityTypeToUpdate : pt
                    );
                    setPriorityTypes(updatedPriorityTypes);
                }
            } catch (error) {
                console.error("Error updating priority type:", error);
            }
        }
    };

    const handleCancelEditPriorityType = (MaLoaiUuTien) => {
        setEditingPriorityTypeId(null);
    };

    return (
        <div className={styles["types-settings-container"]}>
            <h1>Cài Đặt Các Loại</h1>
            <div>
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
                                        <td>{goalType.MaLoaiBanThang}</td>
                                        <td>
                                            {editingGoalTypeId === goalType.MaLoaiBanThang ? (
                                                <input
                                                    type="text"
                                                    value={goalType.TenLoaiBanThang}
                                                    onChange={(e) => handleGoalTypeChange(goalType.MaLoaiBanThang, 'TenLoaiBanThang', e.target.value)}
                                                />
                                            ) : (
                                                goalType.TenLoaiBanThang
                                            )}
                                        </td>
                                        <td>
                                            {editingGoalTypeId === goalType.MaLoaiBanThang ? (
                                                <textarea
                                                    value={goalType.MoTa}
                                                    onChange={(e) => handleGoalTypeChange(goalType.MaLoaiBanThang, 'MoTa', e.target.value)}
                                                />
                                            ) : (
                                                goalType.MoTa
                                            )}
                                        </td>
                                        <td>
                                            {editingGoalTypeId === goalType.MaLoaiBanThang ? (
                                                <>
                                                    <button type="button" style={{ backgroundColor: '#28a745', color: 'white', marginRight: '5px' }} onClick={() => handleSaveEditGoalType(goalType.MaLoaiBanThang)}>Lưu</button>
                                                    <button type="button" onClick={() => handleCancelEditGoalType(goalType.MaLoaiBanThang)}>Hủy</button>
                                                </>
                                            ) : (
                                                <>
                                                    <button type="button" style={{ marginRight: '5px' }} onClick={() => handleEditGoalType(goalType.MaLoaiBanThang)}>Sửa</button>
                                                    <button style={{ backgroundColor: '#dc3545', color: 'white' }} type="button" onClick={() => handleDeleteGoalType(goalType.MaLoaiBanThang)}>Xóa</button>
                                                </>
                                            )}
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
                                        <td>{cardType.MaLoaiThePhat}</td>
                                        <td>
                                            {editingCardTypeId === cardType.MaLoaiThePhat ? (
                                                <input
                                                    type="text"
                                                    value={cardType.TenLoaiThePhat}
                                                    onChange={(e) => handleCardTypeChange(cardType.MaLoaiThePhat, 'TenLoaiThePhat', e.target.value)}
                                                />
                                            ) : (
                                                cardType.TenLoaiThePhat
                                            )}
                                        </td>
                                        <td>
                                            {editingCardTypeId === cardType.MaLoaiThePhat ? (
                                                <textarea
                                                    value={cardType.MoTa}
                                                    onChange={(e) => handleCardTypeChange(cardType.MaLoaiThePhat, 'MoTa', e.target.value)}
                                                />
                                            ) : (
                                                cardType.MoTa
                                            )}
                                        </td>
                                        <td>
                                            {editingCardTypeId === cardType.MaLoaiThePhat ? (
                                                <>
                                                    <button type="button" style={{ backgroundColor: '#28a745', color: 'white', marginRight: '5px' }} onClick={() => handleSaveEditCardType(cardType.MaLoaiThePhat)}>Lưu</button>
                                                    <button type="button" onClick={() => handleCancelEditCardType(cardType.MaLoaiThePhat)}>Hủy</button>
                                                </>
                                            ) : (
                                                <>
                                                    <button type="button" style={{ marginRight: '5px' }} onClick={() => handleEditCardType(cardType.MaLoaiThePhat)}>Sửa</button>
                                                    <button style={{ backgroundColor: '#dc3545', color: 'white' }} type="button" onClick={() => handleDeleteCardType(cardType.MaLoaiThePhat)}>Xóa</button>
                                                </>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        <button type="button" onClick={addCardType}>Thêm loại thẻ phạt</button>
                    </div>

                    {/* Thêm khung Loại Ưu Tiên */}
                    <div className={styles["setting-section-small"]}>
                        <h2>Loại Ưu Tiên</h2>
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
                                {priorityTypes.map((priorityType) => (
                                    <tr key={priorityType.MaLoaiUuTien}>
                                        <td>{priorityType.MaLoaiUuTien}</td>
                                        <td>{priorityType.TenLoaiUuTien}</td>
                                        <td>
                                            {editingPriorityTypeId === priorityType.MaLoaiUuTien ? (
                                                <textarea
                                                    value={priorityType.MoTa}
                                                    onChange={(e) => handlePriorityTypeChange(priorityType.MaLoaiUuTien, 'MoTa', e.target.value)}
                                                />
                                            ) : (
                                                priorityType.MoTa
                                            )}
                                        </td>
                                        <td>
                                            {editingPriorityTypeId === priorityType.MaLoaiUuTien ? (
                                                <>
                                                    <button type="button" style={{ backgroundColor: '#28a745', color: 'white', marginRight: '5px' }} onClick={() => handleSaveEditPriorityType(priorityType.MaLoaiUuTien)}>Lưu</button>
                                                    <button type="button" onClick={() => handleCancelEditPriorityType(priorityType.MaLoaiUuTien)}>Hủy</button>
                                                </>
                                            ) : (
                                                <button type="button" onClick={() => handleEditPriorityType(priorityType.MaLoaiUuTien)}>Sửa</button>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        {/* Không có nút thêm vì không có POST */}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default TypesSettings;