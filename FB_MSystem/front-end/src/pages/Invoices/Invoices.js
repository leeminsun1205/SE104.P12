import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
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
  const { invoiceId } = useParams();
  const navigate = useNavigate();
  const [, setInvoiceData] = useState(null);
  const invoiceData = invoices.find((invoice) => invoice.id === invoiceId);

  const goBackToForm = () => {
    navigate("/invoices");
  };

  useEffect(() => {
    const fetchedInvoiceData = {
      receiptNumber: invoiceId,
      teamName: "Team A",
      fee: "100000",
      receivedAmount: "50000",
      receivedDate: "2024-12-23",
      status: "Đã nhận",
    };

    setInvoiceData(fetchedInvoiceData);
  }, [invoiceId]);

  const formatCurrency = (amount) =>
    new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(amount);

  const calculateRemainingAmount = () => {
    const fee = parseFloat(invoiceData?.fee) || 0;
    const receivedAmount = parseFloat(invoiceData?.receivedAmount) || 0;
    return fee - receivedAmount;
  };

  const handlePrint = () => window.print();

  if (!invoiceData) return <div>Invoice not found.</div>;

  const invoiceFields = [
    { label: "Số biên nhận", value: invoiceData?.receiptNumber },
    { label: "Tên đội bóng", value: invoiceData?.teamName },
    { label: "Lệ phí", value: invoiceData?.fee ? formatCurrency(invoiceData.fee) : "" },
    { label: "Đã nhận", value: invoiceData?.receivedAmount ? formatCurrency(invoiceData.receivedAmount) : "" },
    { label: "Số tiền còn lại", value: invoiceData?.fee && invoiceData?.receivedAmount ? formatCurrency(invoiceData.fee - invoiceData.receivedAmount) : "" },
    { label: "Ngày nhận", value: invoiceData?.receivedDate },
    { label: "Tình trạng", value: invoiceData?.status },
  ];

  return (
    <div className={styles.printable}>
      <div className={styles.invoicePage} id="invoicePage">
        <h1 className={styles.invoiceTitle}>Biên nhận lệ phí</h1>
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
