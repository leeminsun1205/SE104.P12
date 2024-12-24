// pages/Settings/TypesSettings.js
import React, { useState, useEffect } from 'react';
import styles from './TypesSettings.module.css';

function TypesSettings({ API_URL }) {
    const [goalTypes, setGoalTypes] = useState([
        { id: Date.now() + '-0', code: 'BT001', name: 'Bàn thắng thường', description: 'Bàn thắng được ghi trong tình huống thông thường.' },
        { id: Date.now() + '-1', code: 'BT002', name: 'Phản lưới nhà', description: 'Bàn thắng do cầu thủ tự đưa bóng vào lưới nhà.' },
        { id: Date.now() + '-2', code: 'BT003', name: 'Penalty', description: 'Bàn thắng từ chấm phạt đền.' },
    ]);
    const [cardTypes, setCardTypes] = useState([
        { id: Date.now() + '-3', code: 'TP001', name: 'Vàng', description: 'Cảnh cáo cho hành vi phi thể thao.' },
        { id: Date.now() + '-4', code: 'TP002', name: 'Đỏ', description: 'Truất quyền thi đấu do lỗi nghiêm trọng.' },
    ]);
    const [priorityOptions, setPriorityOptions] = useState([
        { code: 'points', name: 'Điểm số' },
        { code: 'goalDifference', name: 'Hiệu số' },
        { code: 'goalsScored', name: 'Số bàn thắng' },
    ]);
    const [rankingPriorityOrder, setRankingPriorityOrder] = useState(['points', 'goalDifference', 'goalsScored']);
    const [saveStatus, setSaveStatus] = useState(null);

    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const response = await fetch(`${API_URL}/types-settings`);
                if (response.ok) {
                    const data = await response.json();
                    setGoalTypes(data.goalTypes ? data.goalTypes.map(gt => ({ ...gt, id: gt.id || Date.now() + '-' + Math.random() })) : goalTypes);
                    setCardTypes(data.cardTypes ? data.cardTypes.map(ct => ({ ...ct, id: ct.id || Date.now() + '-' + Math.random() })) : cardTypes);
                    setPriorityOptions(data.priorityOptions || priorityOptions);
                    setRankingPriorityOrder(data.rankingPriorityOrder || rankingPriorityOrder);
                }
            } catch (error) {
                console.error("Error fetching types settings:", error);
            }
        };

        fetchSettings();
    }, [API_URL]);

    // Goal Types Handlers
    const handleGoalTypeChange = (id, field, value) => {
        const newGoalTypes = goalTypes.map(goalType =>
            goalType.id === id ? { ...goalType, [field]: value } : goalType
        );
        setGoalTypes(newGoalTypes);
    };

    const generateUniqueCode = (prefix) => {
        return `${prefix}${Date.now().toString().slice(-5)}`; // Simple unique code
    };

    const addGoalType = () => {
        setGoalTypes([...goalTypes, { id: Date.now(), code: generateUniqueCode('BT'), name: '', description: '' }]);
    };

    const removeGoalType = (id) => {
        const newGoalTypes = goalTypes.filter(goalType => goalType.id !== id);
        setGoalTypes(newGoalTypes);
    };

    // Card Types Handlers
    const handleCardTypeChange = (id, field, value) => {
        const newCardTypes = cardTypes.map(cardType =>
            cardType.id === id ? { ...cardType, [field]: value } : cardType
        );
        setCardTypes(newCardTypes);
    };

    const addCardType = () => {
        setCardTypes([...cardTypes, { id: Date.now(), code: generateUniqueCode('TP'), name: '', description: '' }]);
    };

    const removeCardType = (id) => {
        const newCardTypes = cardTypes.filter(cardType => cardType.id !== id);
        setCardTypes(newCardTypes);
    };

    // Ranking Priority Handlers
    const handlePriorityOptionChange = (index, field, value) => {
        const newPriorityOptions = [...priorityOptions];
        newPriorityOptions[index][field] = value;
        setPriorityOptions(newPriorityOptions);
    };

    const addPriorityOption = () => {
        const newPriority = { code: generateUniqueCode('PR'), name: '' };
        setPriorityOptions([...priorityOptions, newPriority]);
        setRankingPriorityOrder([...rankingPriorityOrder, newPriority.code]);
    };

    const removePriorityOption = (codeToRemove) => {
        setPriorityOptions(priorityOptions.filter(option => option.code !== codeToRemove));
        setRankingPriorityOrder(rankingPriorityOrder.filter(code => code !== codeToRemove));
    };

    const movePriorityUp = (code) => {
        const index = rankingPriorityOrder.indexOf(code);
        if (index > 0) {
            const newOrder = [...rankingPriorityOrder];
            [newOrder[index], newOrder[index - 1]] = [newOrder[index - 1], newOrder[index]];
            setRankingPriorityOrder(newOrder);
        }
    };

    const movePriorityDown = (code) => {
        const index = rankingPriorityOrder.indexOf(code);
        if (index < rankingPriorityOrder.length - 1) {
            const newOrder = [...rankingPriorityOrder];
            [newOrder[index], newOrder[index + 1]] = [newOrder[index + 1], newOrder[index]];
            setRankingPriorityOrder(newOrder);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaveStatus('loading');

        const settingsData = {
            goalTypes: goalTypes,
            cardTypes: cardTypes,
            rankingPriorityOrder: rankingPriorityOrder,
        };

        try {
            const response = await fetch(`${API_URL}/types-settings`, {
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
                                    <tr key={goalType.id}>
                                        <td>
                                            <input
                                                type="text"
                                                value={goalType.code}
                                                readOnly
                                            />
                                        </td>
                                        <td>
                                            <input
                                                type="text"
                                                value={goalType.name}
                                                onChange={(e) => handleGoalTypeChange(goalType.id, 'name', e.target.value)}
                                            />
                                        </td>
                                        <td>
                                            <textarea
                                                value={goalType.description}
                                                onChange={(e) => handleGoalTypeChange(goalType.id, 'description', e.target.value)}
                                            />
                                        </td>
                                        <td>
                                            <button style={{ backgroundColor: '#dc3545', color: 'white' }} type="button" onClick={() => removeGoalType(goalType.id)}>Xóa</button>
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
                                    <tr key={cardType.id}>
                                        <td>
                                            <input
                                                type="text"
                                                value={cardType.code}
                                                readOnly
                                            />
                                        </td>
                                        <td>
                                            <input
                                                type="text"
                                                value={cardType.name}
                                                onChange={(e) => handleCardTypeChange(cardType.id, 'name', e.target.value)}
                                            />
                                        </td>
                                        <td>
                                            <textarea
                                                value={cardType.description}
                                                onChange={(e) => handleCardTypeChange(cardType.id, 'description', e.target.value)}
                                            />
                                        </td>
                                        <td>
                                            <button style={{ backgroundColor: '#dc3545', color: 'white' }} type="button" onClick={() => removeCardType(cardType.id)}>Xóa</button>
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
                                <th>Hành động</th>
                            </tr>
                        </thead>
                        <tbody>
                            {priorityOptions.map((option) => (
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
                                            onChange={(e) => handlePriorityOptionChange(priorityOptions.findIndex(opt => opt.code === option.code), 'name', e.target.value)}
                                        />
                                    </td>
                                    <td>
                                        {rankingPriorityOrder.includes(option.code) && (
                                            <>
                                                <button
                                                    style={{ backgroundColor: '#007bff', color: 'white' }}
                                                    type="button"
                                                    onClick={() => movePriorityUp(option.code)}
                                                    disabled={rankingPriorityOrder.indexOf(option.code) === 0}
                                                >
                                                    Lên
                                                </button>
                                                <button
                                                    style={{ backgroundColor: '#007bff', color: 'white' }}
                                                    type="button"
                                                    onClick={() => movePriorityDown(option.code)}
                                                    disabled={rankingPriorityOrder.indexOf(option.code) === rankingPriorityOrder.length - 1}
                                                >
                                                    Xuống
                                                </button>
                                                <button style={{ backgroundColor: '#dc3545', color: 'white' }} type="button" onClick={() => removePriorityOption(option.code)}>Xóa</button>
                                            </>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <button type="button" onClick={addPriorityOption}>Thêm loại ưu tiên</button>
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