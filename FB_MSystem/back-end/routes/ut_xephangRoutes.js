const express = require('express');
const ut_XepHangController = require('../controllers/ut_XepHangController');

const router = express.Router();

router.get('/mua-giai/:MaMuaGiai', ut_XepHangController.getByMuaGiai); // Lấy danh sách ưu tiên xếp hạng theo mùa giải
router.put('/mua-giai/:MaMuaGiai', ut_XepHangController.updateTieuChi); // Cập nhật lại tiêu chí xếp hạng

module.exports = router;
