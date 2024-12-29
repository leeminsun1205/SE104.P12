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
  const [lePhiThamSo, setLePhiThamSo] = useState(null); // State để lưu trữ lệ phí từ ThamSo
  const [loadingLePhi, setLoadingLePhi] = useState(true);
  const [errorLePhi, setErrorLePhi] = useState(null);
  const [errors, setErrors] = useState({}); // State để lưu trữ lỗi validation

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

    const fetchLePhi = async () => {
      try {
        const response = await fetch(`${API_URL}/tham-so/le-phi`); // Gọi endpoint mới tạo
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setLePhiThamSo(data.lePhi);
        setFormData(prevFormData => ({ ...prevFormData, LePhi: data.lePhi.toString() })); // Cập nhật luôn vào form data
      } catch (error) {
        setErrorLePhi(error);
      } finally {
        setLoadingLePhi(false);
      }
    };

    fetchLePhi();

  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    // Clear lỗi khi người dùng bắt đầu nhập
    setErrors(prevErrors => ({ ...prevErrors, [e.target.name]: null }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let isValid = true;
    const newErrors = {};

    if (!formData.TenDoiBong) {
      newErrors.TenDoiBong = "Vui lòng chọn tên đội bóng.";
      isValid = false;
    }
    if (!formData.LePhi) {
      newErrors.LePhi = "Vui lòng nhập số tiền.";
      isValid = false;
    }
    if (!formData.SoTienDaNhan) {
      newErrors.SoTienDaNhan = "Vui lòng nhập số tiền đã nhận.";
      isValid = false;
    }
    if (!formData.NgayThanhToan) {
      newErrors.NgayThanhToan = "Vui lòng chọn ngày nhận.";
      isValid = false;
    }

    setErrors(newErrors);

    if (isValid) {
      const newInvoice = {
        id: formData.MaBienNhan,
        ...formData,
      };

      onAddInvoice(newInvoice);
      navigate(`/bien-nhan/${formData.MaBienNhan}`);
    }
  };

  const calculateRemainingAmount = () => {
    const amount = parseFloat(formData.LePhi) || 0;
    const receivedAmount = parseFloat(formData.SoTienDaNhan) || 0;
    return amount - receivedAmount;
  };

  const incrementSoTienDaNhan = (amount) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      SoTienDaNhan: (parseFloat(prevFormData.SoTienDaNhan) || 0) + amount,
    }));
    // Clear lỗi khi thay đổi giá trị
    setErrors(prevErrors => ({ ...prevErrors, SoTienDaNhan: null }));
  };

  const decrementSoTienDaNhan = (amount) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      SoTienDaNhan: Math.max(0, (parseFloat(prevFormData.SoTienDaNhan) || 0) - amount),
    }));
    // Clear lỗi khi thay đổi giá trị
    setErrors(prevErrors => ({ ...prevErrors, SoTienDaNhan: null }));
  };

  const handleSoTienDaNhanChange = (e) => {
    const value = e.target.value;
    if (parseFloat(value) < 0 || value === '-') {
      return; // Prevent negative values
    }
    setFormData({
      ...formData,
      SoTienDaNhan: value,
    });
    // Clear lỗi khi thay đổi giá trị
    setErrors(prevErrors => ({ ...prevErrors, SoTienDaNhan: null }));
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
        {errors.TenDoiBong && <p className={styles.error}>{errors.TenDoiBong}</p>}
        <label>Số tiền (VNĐ):</label>
        <input
          name="LePhi"
          type="number"
          value={formData.LePhi}
          readOnly
          placeholder="Số tiền"
        />
        {errors.LePhi && <p className={styles.error}>{errors.LePhi}</p>}
        <label>Bằng chữ:</label>
        <input
          type="text"
          value={toVietnameseCurrencyString(formData.LePhi)}
          readOnly
          placeholder="Số tiền bằng chữ"
        />
        <label>Số tiền đã nhận (VNĐ):</label>
        <input
          name="SoTienDaNhan"
          type="number"
          value={formData.SoTienDaNhan}
          onChange={handleSoTienDaNhanChange}
          placeholder="Số tiền đã nhận"
        />
        {errors.SoTienDaNhan && <p className={styles.error}>{errors.SoTienDaNhan}</p>}
        <button type="button" className={styles.showIncrementButtons} onClick={toggleIncrementButtons}>
          {showIncrementButtons ? "Ẩn nhanh" : "Thêm nhanh"}
        </button>
        {showIncrementButtons && (
          <div className={styles.incrementButtonsContainer}>
            <div className={styles.incrementButtonsRow}>
              <button type="button" onClick={() => incrementSoTienDaNhan(500000)}>
                +500K
              </button>
              <button type="button" onClick={() => incrementSoTienDaNhan(1000000)}>
                +1 Triệu
              </button>
              <button type="button" onClick={() => incrementSoTienDaNhan(10000000)}>
                +10 Triệu
              </button>
              <button type="button" onClick={() => incrementSoTienDaNhan(100000000)}>
                +100 Triệu
              </button>
            </div>
            <div className={styles.decrementButtonsRow}>
              <button type="button" onClick={() => decrementSoTienDaNhan(500000)}>
                -500K
              </button>
              <button type="button" onClick={() => decrementSoTienDaNhan(1000000)}>
                -1 Triệu
              </button>
              <button type="button" onClick={() => decrementSoTienDaNhan(10000000)}>
                -10 Triệu
              </button>
              <button type="button" onClick={() => decrementSoTienDaNhan(100000000)}>
                -100 Triệu
              </button>
            </div>
          </div>
        )}
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
        {errors.NgayThanhToan && <p className={styles.error}>{errors.NgayThanhToan}</p>}
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
        />
        <button type="submit">Xuất biên nhận</button>
      </form>
    </div>
  );
}

export default InvoiceForm;