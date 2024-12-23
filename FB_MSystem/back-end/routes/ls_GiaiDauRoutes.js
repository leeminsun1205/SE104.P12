const express = require('express');
const lichSuGiaiDauController = require('../controllers/lichSuGiaiDauController');

const router = express.Router();

router.get('/doi-bong/:MaDoiBong', lichSuGiaiDauController.getByDoiBong); // Lấy lịch sử giải đấu của đội bóng

module.exports = router;
