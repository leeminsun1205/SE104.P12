const express = require('express');
const bangXepHangController = require('../controllers/bangXepHangController');

const router = express.Router();

router.get('/mua-giai/:MaMuaGiai', bangXepHangController.getByMuaGiai); // Lấy bảng xếp hạng theo mùa giải

module.exports = router;
