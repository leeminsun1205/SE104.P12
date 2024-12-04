const express = require('express');
const router = express.Router();
const {
    getUT_XepHang,
    createUT_XepHang,
    deleteUT_XepHang,
    updateUT_XepHang,
} = require('../controllers/ut_xephangController');

// Lấy danh sách ưu tiên xếp hạng
router.get('/', getUT_XepHang);

// Thêm mới ưu tiên xếp hạng
router.post('/', createUT_XepHang);

// Xóa ưu tiên xếp hạng theo mã mùa giải và mã loại ưu tiên
router.delete('/:MaMuaGiai/:MaLoaiUT', deleteUT_XepHang);

// Cập nhật ưu tiên xếp hạng theo mã mùa giải và mã loại ưu tiên
router.put('/:MaMuaGiai/:MaLoaiUT', updateUT_XepHang);

module.exports = router;
