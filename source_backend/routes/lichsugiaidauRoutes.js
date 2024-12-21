const express = require('express');
const LichSuGiaiDauController = require('../controllers/lichsugiaidauController');

const router = express.Router();

router.get('/doibong/:MaDoiBong', LichSuGiaiDauController.getByDoiBong); // Lấy lịch sử giải đấu của đội bóng

module.exports = router;
