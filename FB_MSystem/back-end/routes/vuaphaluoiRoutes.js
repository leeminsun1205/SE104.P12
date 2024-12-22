const express = require('express');
const VuaPhaLuoiController = require('../controllers/vuaphaluoiController');

const router = express.Router();

router.get('/muagiai/:MaMuaGiai', VuaPhaLuoiController.getByMuaGiai); // Lấy danh sách vua phá lưới theo mùa giải

module.exports = router;
