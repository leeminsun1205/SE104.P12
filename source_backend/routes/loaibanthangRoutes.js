const express = require('express');
const router = express.Router();
const {
    getLoaiBanThang,
    createLoaiBanThang,
    updateLoaiBanThang,
    deleteLoaiBanThang,
} = require('../controllers/loaibanthangController');

// Lấy danh sách loại bàn thắng
router.get('/', getLoaiBanThang);

// Thêm loại bàn thắng mới
router.post('/', createLoaiBanThang);

// Cập nhật loại bàn thắng
router.put('/:MaLoaiBanThang', updateLoaiBanThang);

// Xóa loại bàn thắng
router.delete('/:MaLoaiBanThang', deleteLoaiBanThang);

module.exports = router;
