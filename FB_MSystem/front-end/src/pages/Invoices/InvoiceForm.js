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
    SoTienDaNhan: "",
    NgayThanhToan: "",
    LyDo: "",
    TinhTrang: "Đã hoàn thành",
  });
  const [availableTeams, setAvailableTeams] = useState([]);
  const [loadingTeams, setLoadingTeams] = useState(true);
  const [errorTeams, setErrorTeams] = useState(null);
  const [showIncrementButtons, setShowIncrementButtons] = useState(false);
  const [lePhiThamSo, setLePhiThamSo] = useState(null);
  const [loadingLePhi, setLoadingLePhi] = useState(true);
  const [errorLePhi, setErrorLePhi] = useState(null);
  const [submittedInvoice, setSubmittedInvoice] = useState(null); // State để lưu biên nhận đã submit

  useEffect(() => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      MaBienNhan: Date.now().toString(),
    }));

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

    const fetchLePhi = async () => {
      try {
        const response = await fetch(`${API_URL}/tham-so/le-phi`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setLePhiThamSo(data.lePhi);
        setFormData((prevFormData) => ({
          ...prevFormData,
          LePhi: data.lePhi.toString(),
        }));
      } catch (error) {
        setErrorLePhi(error);
      } finally {
        setLoadingLePhi(false);
      }
    };

    fetchLePhi();
  }, [API_URL]);

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
    setSubmittedInvoice(newInvoice); // Lưu biên nhận đã tạo
  };

  const calculateRemainingAmount = () => {
    const amount = parseFloat(formData.LePhi) || 0;
    const receivedAmount = parseFloat(formData.SoTienDaNhan) || 0;
    return amount - receivedAmount;
  };

  const toggleIncrementButtons = () => {
    setShowIncrementButtons(!showIncrementButtons);
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
        {/* Form nhập liệu */}
        <label>Số biên nhận:</label>
        <input
          name="MaBienNhan"
          value={formData.MaBienNhan}
          readOnly
        />
        <label>Tên đội bóng:</label>
        <select name="TenDoiBong" value={formData.TenDoiBong} onChange={handleChange}>
          <option value="">-- Chọn đội bóng --</option>
          {availableTeams.map((team) => (
            <option key={team.MaDoiBong} value={team.TenDoiBong}>
              {team.TenDoiBong}
            </option>
          ))}
        </select>
        <label>Số tiền (VNĐ):</label>
        <input name="LePhi" type="number" value={formData.LePhi} readOnly />
        <label>Bằng chữ:</label>
        <input
          type="text"
          value={toVietnameseCurrencyString(formData.LePhi)}
          readOnly
        />
        <label>Số tiền đã nhận (VNĐ):</label>
        <input
          name="SoTienDaNhan"
          type="number"
          value={formData.SoTienDaNhan}
          onChange={handleChange}
        />
        <label>Số tiền còn lại:</label>
        <input
          type="text"
          value={calculateRemainingAmount().toLocaleString("vi-VN")}
          readOnly
        />
        <label>Ngày nhận:</label>
        <input
          name="NgayThanhToan"
          type="date"
          value={formData.NgayThanhToan}
          onChange={handleChange}
        />
        <label>Lý do:</label>
        <input
          name="LyDo"
          value={formData.LyDo}
          onChange={handleChange}
        />
        <button type="submit">Xuất biên nhận</button>
      </form>
      {submittedInvoice && (
        <div className={styles.invoiceDetails}>
          <h3>Thông tin biên nhận đã tạo:</h3>
          <p><strong>Mã biên nhận:</strong> {submittedInvoice.MaBienNhan}</p>
          <p><strong>Tên đội bóng:</strong> {submittedInvoice.TenDoiBong}</p>
          <p><strong>Số tiền:</strong> {submittedInvoice.LePhi} VNĐ</p>
          <p><strong>Số tiền đã nhận:</strong> {submittedInvoice.SoTienDaNhan} VNĐ</p>
          <p><strong>Ngày nhận:</strong> {submittedInvoice.NgayThanhToan}</p>
          <p><strong>Lý do:</strong> {submittedInvoice.LyDo}</p>
          <p><strong>Tình trạng:</strong> {submittedInvoice.TinhTrang}</p>
        </div>
      )}
    </div>
  );
}

export default InvoiceForm;
