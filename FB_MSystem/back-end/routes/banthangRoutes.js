const express = require('express');
const banThangController = require('../controllers/banThangController');

const router = express.Router();

router.get('/', banThangController.getAll); // Lấy danh sách tất cả bàn thắng
router.get('/tran-dau/:MaTranDau', banThangController.getByTranDau); // Lấy bàn thắng theo trận đấu
router.post('/', banThangController.create); // Thêm bàn thắng mới
router.delete('/:id', banThangController.delete); // Xóa bàn thắng

module.exports = router;
