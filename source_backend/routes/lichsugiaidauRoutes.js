const express = require('express');
const router = express.Router();
const {
    getLichSuGiaiDau,
    createLichSuGiaiDau,
    deleteLichSuGiaiDau,
    updateLichSuGiaiDau
} = require('../controllers/lichsugiaidauController');

// Lấy tất cả lịch sử giải đấu
router.get('/', getLichSuGiaiDau);

// Thêm lịch sử giải đấu mới
router.post('/', createLichSuGiaiDau);

// Xóa lịch sử giải đấu
router.delete('/:id', deleteLichSuGiaiDau);

// Cập nhật lịch sử giải đấu
router.put('/:id', updateLichSuGiaiDau);

module.exports = router;
