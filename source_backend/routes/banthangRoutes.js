const express = require('express');
const router = express.Router();
const {
    getBanThang,
    createBanThang,
    updateBanThang,
    deleteBanThang,
} = require('../controllers/banthangController');

// Lấy danh sách bàn thắng
router.get('/', getBanThang);

// Thêm một bàn thắng mới
router.post('/', createBanThang);

// Cập nhật thông tin bàn thắng
router.put('/:MaBanThang', updateBanThang);

// Xóa một bàn thắng
router.delete('/:MaBanThang', deleteBanThang);

module.exports = router;
