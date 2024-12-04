const express = require('express');
const {
    getCauThu,
    createCauThu,
    deleteCauThu,
    updateCauThu, // Thêm hàm cập nhật cầu thủ
} = require('../controllers/cauthuController');

const router = express.Router();

// Lấy danh sách cầu thủ
router.get('/', getCauThu);

// Thêm cầu thủ mới
router.post('/', createCauThu);

// Xóa cầu thủ theo mã cầu thủ
router.delete('/:MaCauThu', deleteCauThu);

// Cập nhật thông tin cầu thủ
router.put('/:MaCauThu', updateCauThu);

module.exports = router;
