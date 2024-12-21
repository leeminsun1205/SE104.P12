const express = require('express');
const UtXepHangController = require('../controllers/ut_xephangController');

const router = express.Router();

router.get('/muagiai/:MaMuaGiai', UtXepHangController.getByMuaGiai); // Lấy danh sách ưu tiên xếp hạng theo mùa giải
router.post('/', UtXepHangController.create); // Thêm ưu tiên xếp hạng
router.delete('/:MaMuaGiai/:MaLoaiUT', UtXepHangController.delete); // Xóa ưu tiên xếp hạng

module.exports = router;
