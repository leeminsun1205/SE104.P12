const express = require('express');
const router = express.Router();
const {
    getSanThiDau,
    createSanThiDau,
    updateSanThiDau,
    deleteSanThiDau,
} = require('../controllers/santhidauController');

// Lấy danh sách sân thi đấu
router.get('/', getSanThiDau);

// Thêm sân thi đấu mới
router.post('/', createSanThiDau);

// Cập nhật thông tin sân thi đấu
router.put('/:MaSan', updateSanThiDau);

// Xóa sân thi đấu
router.delete('/:MaSan', deleteSanThiDau);

module.exports = router;
