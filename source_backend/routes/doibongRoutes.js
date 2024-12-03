const express = require('express');
const router = express.Router();
const {
    getDoiBong,
    createDoiBong,
    updateDoiBong,
    deleteDoiBong,
} = require('../controllers/doibongController');

// Lấy danh sách đội bóng
router.get('/', getDoiBong);

// Thêm đội bóng mới
router.post('/', createDoiBong);

// Cập nhật thông tin đội bóng
router.put('/:MaDoiBong', updateDoiBong);

// Xóa đội bóng
router.delete('/:MaDoiBong', deleteDoiBong);

module.exports = router;
