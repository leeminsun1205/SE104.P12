const express = require('express');
const router = express.Router();
const {
    getBangXepHang,
    createBangXepHang,
    deleteBangXepHang,
    updateBangXepHang,
} = require('../controllers/bangxephangController');

// Lấy danh sách bảng xếp hạng
router.get('/', getBangXepHang);

// Thêm mới bảng xếp hạng
router.post('/', createBangXepHang);

// Xóa một bảng xếp hạng theo mã mùa giải, mã vòng đấu, và mã đội bóng
router.delete('/:MaMuaGiai/:MaVongDau/:MaDoiBong', deleteBangXepHang);

// Cập nhật một bảng xếp hạng theo mã mùa giải, mã vòng đấu, và mã đội bóng
router.put('/:MaMuaGiai/:MaVongDau/:MaDoiBong', updateBangXepHang);

module.exports = router;
