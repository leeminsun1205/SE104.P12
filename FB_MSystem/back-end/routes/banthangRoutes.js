const express = require('express');
const BanThangController = require('../controllers/banthangController');

const router = express.Router();

router.get('/', BanThangController.getAll); // Lấy danh sách tất cả bàn thắng
router.get('/trandau/:MaTranDau', BanThangController.getByTranDau); // Lấy bàn thắng theo trận đấu
router.post('/', BanThangController.create); // Thêm bàn thắng mới
router.delete('/:id', BanThangController.delete); // Xóa bàn thắng

module.exports = router;
