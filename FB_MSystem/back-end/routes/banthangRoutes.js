const express = require('express');
const banThangController = require('../controllers/banThangController');

const router = express.Router();

router.get('/', banThangController.getAll); // Lấy danh sách tất cả bàn thắng
router.get('/tran-dau/:MaTranDau', banThangController.getByTranDau); // Lấy bàn thắng theo trận đấu
router.get('/cau-thu/:MaCauThu', banThangController.getByTranDau); // Lấy bàn thắng theo trận đấu
router.get('/:MaTranDau/:id', banThangController.getByTranDauandId);
router.post('/tran-dau/:MaTranDau/doi-bong/:MaDoiBong/cau-thu/:MaCauThu', banThangController.create); // Thêm bàn thắng mới cho trận đấu và đội bóng
router.put('/:MaTranDau/:id', banThangController.putByTranDauandID);
router.delete('/:id', banThangController.delete); // Xóa bàn thắng
router.delete('/:MaTranDau/:id', banThangController.deleteByTranDauandID);
module.exports = router;
