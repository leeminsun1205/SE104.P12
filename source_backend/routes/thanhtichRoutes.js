const express = require('express');
const router = express.Router();
const {
    getThanhTich,
    createThanhTich,
    deleteThanhTich,
    updateThanhTich
} = require('../controllers/thanhtichController');

// Lấy tất cả thành tích
router.get('/', getThanhTich);

// Thêm thành tích mới
router.post('/', createThanhTich);

// Xóa thành tích
router.delete('/:id', deleteThanhTich);

// Cập nhật thành tích
router.put('/:id', updateThanhTich);

module.exports = router;
