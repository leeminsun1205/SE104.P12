import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./InvoiceForm.module.css";
import { toVietnameseCurrencyString } from "./utils";

function InvoiceForm({ API_URL, onAddInvoice }) {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    MaBienNhan: "",
    TenDoiBong: "",
    LePhi: "",
    receivedAmount: "",
    NgayThanhToan: "",
    LyDo: "",
    TinhTrang: "Đã hoàn thành",
  });
  const [availableTeams, setAvailableTeams] = useState([]);
  const [loadingTeams, setLoadingTeams] = useState(true);
  const [errorTeams, setErrorTeams] = useState(null);

  useEffect(() => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      MaBienNhan: Date.now().toString(),
    }));

    // Fetch available teams
    const fetchAvailableTeams = async () => {
      try {
        const response = await fetch(`${API_URL}/doi-bong/`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.TinhTrang}`);
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
      id: formData.MaBienNhan,
      ...formData,
    };

    onAddInvoice(newInvoice);
    navigate(`/bien-nhan/${formData.MaBienNhan}`);
  };

  const calculateRemainingAmount = () => {
    const amount = parseFloat(formData.LePhi) || 0;
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
          name="MaBienNhan"
          value={formData.MaBienNhan}
          readOnly
          placeholder="Số biên nhận (Tự động tạo)"
        />
        <label>Tên đội bóng:</label>
        <select
          name="TenDoiBong"
          value={formData.TenDoiBong}
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
          name="LePhi"
          type="number"
          value={formData.LePhi}
          onChange={handleChange}
          placeholder="Số tiền"
        />
        <label>Bằng chữ:</label>
        <input
          type="text"
          value={toVietnameseCurrencyString(formData.LePhi)}
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
          name="NgayThanhToan"
          type="date"
          value={formData.NgayThanhToan}
          onChange={handleChange}
          placeholder="Ngày nhận"
        />
        <label>Lý do:</label>
        <input
          name="LyDo"
          value={formData.LyDo}
          onChange={handleChange}
          placeholder="Lý do"
        />
        <label>Tình trạng:</label>
        <input
          name="TinhTrang"
          value={formData.TinhTrang}
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