const express = require('express');
const ut_XepHangController = require('../controllers/ut_XepHangController');

const router = express.Router();

router.get('/mua-giai/:MaMuaGiai', ut_XepHangController.getByMuaGiai); // Lấy danh sách ưu tiên xếp hạng theo mùa giải
router.post('/', ut_XepHangController.create); // Thêm ưu tiên xếp hạng
router.delete('/:MaMuaGiai/:MaLoaiUT', ut_XepHangController.delete); // Xóa ưu tiên xếp hạng

module.exports = router;
