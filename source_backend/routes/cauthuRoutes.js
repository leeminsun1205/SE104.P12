const express = require('express');
const router = express.Router();
const { getCauthu, createCauthu, deleteCauthu, updateCauthu } = require('../controllers/cauthuController');

// Lấy danh sách cầu thủ
router.get('/', getCauthu);

// Tạo mới cầu thủ
router.post('/', createCauthu);

// Xóa cầu thủ
router.delete('/:MaCauThu', deleteCauthu);

// Cập nhật cầu thủ
router.put('/:MaCauThu', updateCauthu);

module.exports = router;
