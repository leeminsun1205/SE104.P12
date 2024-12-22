const express = require('express');
const DsThePhatController = require('../controllers/ds_thephatController');

const router = express.Router();

router.get('/vongdau/:MaVongDau', DsThePhatController.getByVongDau); // Lấy danh sách thẻ phạt theo vòng đấu
router.get('/muagiai/:MaMuaGiai', DsThePhatController.getByMuaGiai); // Lấy danh sách thẻ phạt theo mùa giải

module.exports = router;
