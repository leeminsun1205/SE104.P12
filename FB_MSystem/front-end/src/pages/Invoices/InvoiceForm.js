import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./InvoiceForm.module.css";
import { toVietnameseCurrencyString } from "./utils";

function InvoiceForm({ API_URL, onAddInvoice }) {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    receiptNumber: "",
    teamName: "",
    amount: "",
    receivedAmount: "",
    receivedDate: "",
    reason: "",
    status: "Đã hoàn thành",
  });
  const [availableTeams, setAvailableTeams] = useState([]);
  const [loadingTeams, setLoadingTeams] = useState(true);
  const [errorTeams, setErrorTeams] = useState(null);

  useEffect(() => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      receiptNumber: Date.now().toString(),
    }));

    // Fetch available teams
    const fetchAvailableTeams = async () => {
      try {
        const response = await fetch(`${API_URL}/doi-bong/`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setAvailableTeams(data.doiBong);
      } catch (error) {
        setErrorTeams(error);
      } finally {
        setLoadingTeams(false);
      }
    };

    fetchAvailableTeams();
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newInvoice = {
      id: formData.receiptNumber,
      ...formData,
    };

    onAddInvoice(newInvoice);
    navigate(`/bien-nhan/${formData.receiptNumber}`);
  };

  const calculateRemainingAmount = () => {
    const amount = parseFloat(formData.amount) || 0;
    const receivedAmount = parseFloat(formData.receivedAmount) || 0;
    return amount - receivedAmount;
  };

  if (loadingTeams) {
    return <div>Đang tải danh sách đội bóng...</div>;
  }

  if (errorTeams) {
    return <div>Lỗi khi tải danh sách đội bóng: {errorTeams.message}</div>;
  }

  return (
    <div className={styles.formContainer}>
      <form onSubmit={handleSubmit}>
        <h2>Nhập thông tin biên nhận</h2>
        <label>Số biên nhận:</label>
        <input
          name="receiptNumber"
          value={formData.receiptNumber}
          readOnly
          placeholder="Số biên nhận (Tự động tạo)"
        />
        <label>Tên đội bóng:</label>
        <select
          name="teamName"
          value={formData.teamName}
          onChange={handleChange}
        >
          <option value="">-- Chọn đội bóng --</option>
          {availableTeams.map((team) => (
            <option key={team.MaDoiBong} value={team.TenDoiBong}>
              {team.TenDoiBong}
            </option>
          ))}
        </select>
        <label>Số tiền (VNĐ):</label>
        <input
          name="amount"
          type="number"
          value={formData.amount}
          onChange={handleChange}
          placeholder="Số tiền"
        />
        <label>Bằng chữ:</label>
        <input
          type="text"
          value={toVietnameseCurrencyString(formData.amount)}
          readOnly
          placeholder="Số tiền bằng chữ"
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
        <label>Lý do:</label>
        <input
          name="reason"
          value={formData.reason}
          onChange={handleChange}
          placeholder="Lý do"
        />
        <label>Tình trạng:</label>
        <input
          name="status"
          value={formData.status}
          onChange={handleChange}
          readOnly
        >
        </input>
        <button type="submit">Xuất biên nhận</button>
      </form>
    </div>
  );
}

export default InvoiceForm;