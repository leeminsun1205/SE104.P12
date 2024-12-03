const express = require('express');
const router = express.Router();
const {
    getLoaiUuTien,
    createLoaiUuTien,
    updateLoaiUuTien,
    deleteLoaiUuTien,
} = require('../controllers/loaiuutienController');

// Lấy danh sách loại ưu tiên
router.get('/', getLoaiUuTien);

// Thêm loại ưu tiên mới
router.post('/', createLoaiUuTien);

// Cập nhật loại ưu tiên
router.put('/:MaLoaiUT', updateLoaiUuTien);

// Xóa loại ưu tiên
router.delete('/:MaLoaiUT', deleteLoaiUuTien);

module.exports = router;
