const express = require('express');
const router = express.Router();
const {
    getTranDau,
    createTranDau,
    deleteTranDau,
    updateTranDau,
} = require('../controllers/trandauController');
const { autoSchedule, } = require('../controllers/autoScheduleController'); 

// Lấy danh sách trận đấu
router.get('/', getTranDau);

// Thêm mới trận đấu
router.post('/', createTranDau);

// Xóa trận đấu theo mã trận đấu
router.delete('/:MaTranDau', deleteTranDau);

// Cập nhật trận đấu theo mã trận đấu
router.put('/:MaTranDau', updateTranDau);

// Xếp lịch thi đấu tự động
router.post('/schedule/:MaMuaGiai', autoSchedule);

module.exports = router;
