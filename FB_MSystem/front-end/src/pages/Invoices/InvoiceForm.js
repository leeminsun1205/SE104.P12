import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./InvoiceForm.module.css"; // Import CSS

function InvoiceForm({ onAddInvoice }) {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        receiptNumber: "",
        teamName: "",
        fee: "",
        receivedAmount: "",
        receivedDate: "",
        status: "",
    });

    const [isSubmitted, setIsSubmitted] = useState(false);

    useEffect(() => {
        setFormData((prevFormData) => ({
            ...prevFormData,
            receiptNumber: Date.now().toString(),
        }));
    }, []);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const newInvoice = {
            id: formData.receiptNumber,
            ...formData,
        };

        onAddInvoice(newInvoice);
        navigate(`/invoices/${formData.receiptNumber}`);
    };

    const calculateRemainingAmount = () => {
        const fee = parseFloat(formData.fee) || 0;
        const receivedAmount = parseFloat(formData.receivedAmount) || 0;
        return fee - receivedAmount;
    };

    return (
        <div className={styles.formContainer}>
            <form onSubmit={handleSubmit}>
                <h2>Nhập thông tin hóa đơn</h2>
                <label>Số biên nhận:</label>
                <input
                    name="receiptNumber"
                    value={formData.receiptNumber}
                    readOnly 
                    placeholder="Số biên nhận (Tự động tạo)"
                />
                <label>Tên đội bóng:</label>
                <input
                    name="teamName"
                    value={formData.teamName}
                    onChange={handleChange}
                    placeholder="Tên đội bóng"
                />
                <label>Lệ phí (VNĐ):</label>
                <input
                    name="fee"
                    type="number"
                    value={formData.fee}
                    onChange={handleChange}
                    placeholder="Lệ phí"
                />
                <label>Số tiền đã nhận (VNĐ):</label>
                <input
                    name="receivedAmount"
                    type="number"
                    value={formData.receivedAmount}
                    onChange={handleChange}
                    placeholder="Số tiền đã nhận"
                />
                <label>Số tiền còn lại:</label>
                <input
                    type="text"
                    value={calculateRemainingAmount().toLocaleString("vi-VN")}
                    readOnly
                    placeholder="Số tiền còn lại"
                />
                <label>Ngày nhận:</label>
                <input
                    name="receivedDate"
                    type="date"
                    value={formData.receivedDate}
                    onChange={handleChange}
                    placeholder="Ngày nhận"
                />
                <label>Tình trạng:</label>
                <select
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                >
                    <option value="">-- Trạng thái --</option>
                    <option value="Đã nhận">Đã nhận</option>
                    <option value="Chưa nhận">Chưa nhận</option>
                </select>
                <button type="submit">Xuất biên nhận</button>
            </form>
        </div>
    );
}

export default InvoiceForm;
