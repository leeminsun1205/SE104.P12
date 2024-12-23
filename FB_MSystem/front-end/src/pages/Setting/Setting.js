import React, { useState } from 'react';
import './Setting.module.css';

function Setting() {
    const [ticketClass, setTicketClass] = useState({
        code: '',
        name: '',
        priceRatio: 0
    });
    
    const [otherSettings, setOtherSettings] = useState({
        maxIntermediateAirports: 2,
        minFlightTime: 30,
        minStopTime: 10,
        maxStopTime: 20,
        latestBookingTime: 24,
        cancelBookingTime: 0
    });

    const handleChangeTicketClass = (e) => {
        setTicketClass({ ...ticketClass, [e.target.name]: e.target.value });
    };

    const handleChangeOtherSettings = (e) => {
        setOtherSettings({ ...otherSettings, [e.target.name]: e.target.value });
    };

    return (
        <div className="setting-container">
            <h1>Cài Đặt</h1>
            <div className="setting-section">
                <div className="ticket-class-form">
                    <h2>Thêm, Sửa, Xóa Hạng Vé</h2>
                    <form>
                        <label>Mã hạng vé</label>
                        <input 
                            type="text" 
                            name="code" 
                            value={ticketClass.code} 
                            onChange={handleChangeTicketClass}
                        />

                        <label>Tên hạng vé</label>
                        <input 
                            type="text" 
                            name="name" 
                            value={ticketClass.name} 
                            onChange={handleChangeTicketClass}
                        />

                        <label>Tỉ lệ đơn giá</label>
                        <input 
                            type="number" 
                            name="priceRatio" 
                            value={ticketClass.priceRatio} 
                            onChange={handleChangeTicketClass}
                        />

                        <div className="button-group">
                            <button type="button">Thêm</button>
                            <button type="button">Sửa</button>
                            <button type="button">Xóa</button>
                        </div>
                    </form>
                </div>

                <div className="ticket-class-list">
                    <h2>Danh sách hạng vé</h2>
                    <ul>
                        <li>BC - Thương Gia - 1.05</li>
                        <li>EC - Phổ Thông - 1.00</li>
                    </ul>
                </div>
            </div>

            <h2>Thay đổi các tham số khác</h2>
            <div className="other-settings">
                <div className="setting-group">
                    <label>Số sân bay trung gian tối đa</label>
                    <input 
                        type="number" 
                        name="maxIntermediateAirports" 
                        value={otherSettings.maxIntermediateAirports} 
                        onChange={handleChangeOtherSettings}
                    />
                </div>

                <div className="setting-group">
                    <label>Thời gian bay tối thiểu</label>
                    <input 
                        type="number" 
                        name="minFlightTime" 
                        value={otherSettings.minFlightTime} 
                        onChange={handleChangeOtherSettings}
                    /> phút
                </div>

                <div className="setting-group">
                    <label>Thời gian dừng tối thiểu</label>
                    <input 
                        type="number" 
                        name="minStopTime" 
                        value={otherSettings.minStopTime} 
                        onChange={handleChangeOtherSettings}
                    /> phút
                </div>

                <div className="setting-group">
                    <label>Thời gian dừng tối đa</label>
                    <input 
                        type="number" 
                        name="maxStopTime" 
                        value={otherSettings.maxStopTime} 
                        onChange={handleChangeOtherSettings}
                    /> phút
                </div>

                <div className="setting-group">
                    <label>Thời gian đặt vé chậm nhất</label>
                    <input 
                        type="number" 
                        name="latestBookingTime" 
                        value={otherSettings.latestBookingTime} 
                        onChange={handleChangeOtherSettings}
                    /> giờ
                </div>

                <div className="setting-group">
                    <label>Thời gian huỷ vé đặt vé</label>
                    <input 
                        type="number" 
                        name="cancelBookingTime" 
                        value={otherSettings.cancelBookingTime} 
                        onChange={handleChangeOtherSettings}
                    /> giờ
                </div>
            </div>

            <button className="save-button">Lưu</button>
        </div>
    );
}

export default Setting;
