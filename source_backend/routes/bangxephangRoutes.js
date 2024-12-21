const express = require('express');
const BangXepHangController = require('../controllers/bangxephangController');

const router = express.Router();

router.get('/muagiai/:MaMuaGiai', BangXepHangController.getByMuaGiai); // Lấy bảng xếp hạng theo mùa giải
router.get('/vongdau/:MaVongDau', BangXepHangController.getByVongDau); // Lấy bảng xếp hạng theo vòng đấu

module.exports = router;
