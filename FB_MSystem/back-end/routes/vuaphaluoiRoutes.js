const express = require('express');
const vuaPhaLuoiController = require('../controllers/vuaPhaLuoiController');

const router = express.Router();

router.get('/mua-giai/:MaMuaGiai', vuaPhaLuoiController.getByMuaGiai); // Lấy danh sách vua phá lưới theo mùa giải

module.exports = router;
