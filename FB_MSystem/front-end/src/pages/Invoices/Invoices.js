import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toVietnameseCurrencyString } from "./utils";
import styles from "./Invoices.module.css";

const PLACEHOLDER = "..........................................................................................................";

const InvoiceField = ({ label, value }) => (
  <p className={styles.invoiceRow}>
    <span className={styles.label}>{label}:</span>
    <span className={styles.value}>{value || PLACEHOLDER}</span>
  </p>
);

const SignatureBox = ({ label }) => (
  <div className={styles.signatureBox}>
    <p className={styles.signatureLabel}>{label}</p>
    <div className={styles.signatureLine}></div>
  </div>
);

function Invoices({ invoices }) {
  const { MaBienNhan } = useParams();
  const navigate = useNavigate();
  const invoiceData = invoices.find((invoice) => invoice.MaBienNhan === MaBienNhan);

  const goBackToForm = () => {
    navigate("/bien-nhan");
  };

  const formatCurrency = (amount) =>
    new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(amount);


  const handlePrint = () => window.print();

  if (!invoiceData) {
    return (
      <div className={styles.errorMessage}>
        <p>Không tìm thấy hóa đơn. Vui lòng kiểm tra lại mã hóa đơn.</p>
        <button className={styles.backButton} onClick={goBackToForm}>
          <i className="fas fa-arrow-left"></i> Quay lại
        </button>
      </div>
    );
  }

  const invoiceFields = [
    { label: "Số biên nhận", value: invoiceData?.MaBienNhan },
    { label: "Tên đội bóng", value: invoiceData?.TenDoiBong },
    { label: "Số tiền", value: invoiceData?.LePhi ? formatCurrency(invoiceData.LePhi) : "" },
    { label: "Bằng chữ", value: toVietnameseCurrencyString(invoiceData?.LePhi) },
    { label: "Đã nhận", value: invoiceData?.SoTienDaNhan ? formatCurrency(invoiceData.SoTienDaNhan) : "" },
    { label: "Số tiền còn lại", value: invoiceData?.LePhi && invoiceData?.SoTienDaNhan ? formatCurrency(invoiceData.LePhi - invoiceData.SoTienDaNhan) : "" },
    { label: "Ngày nhận", value: invoiceData?.NgayThanhToan },
    { label: "Lý do", value: invoiceData?.LyDo },
    { label: "Tình trạng", value: invoiceData?.TinhTrang },
  ];
  return (
    <div className={styles.printable}>
      <div className={styles.invoicePage} id="invoicePage">
        <h1 className={styles.invoiceTitle}>Biên Nhận</h1>
        <div className={styles.invoiceContent}>
          <div className={styles.invoiceSection}>
            {invoiceFields.map(({ label, value }) => (
              <InvoiceField key={label} label={label} value={value} />
            ))}
          </div>
          <div className={styles.signatureSection}>
            <SignatureBox label="Chữ ký người nộp" />
            <SignatureBox label="Chữ ký người nhận" />
          </div>
          <p className={styles.printDate}>Ngày in: {new Date().toLocaleDateString("vi-VN")}</p>
        </div>
        <button className={styles.printButton} onClick={handlePrint}>
          <i className="fas fa-print"></i> In biên nhận
        </button>
        <button className={styles.backButton} onClick={goBackToForm}>
          <i className="fas fa-arrow-left"></i> Quay lại
        </button>
      </div>
    </div>

  );
}

export default Invoices;