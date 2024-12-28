const express = require('express');
const DbCtController = require('../controllers/db_CtController');
const router = express.Router();

// Lấy danh sách cầu thủ theo đội bóng
router.get('/doi-bong/:MaDoiBong/cau-thu', DbCtController.getByDoiBong);
router.get('/doi-bong/:MaDoiBong/cau-thu/:MaCauThu', DbCtController.getByCauThu);

// Thêm liên kết mới giữa đội bóng và cầu thủ
router.post('/create', DbCtController.create);

// Thêm nhiều liên kết giữa đội bóng và cầu thủ
router.post('/createMany', DbCtController.createMany);

// Cập nhật liên kết giữa đội bóng và cầu thủ
router.put('/doi-bong/:MaDoiBong/cau-thu/:MaCauThu', DbCtController.update);

// Xóa liên kết giữa đội bóng và cầu thủ
router.delete('/doi-bong/:MaDoiBong/cau-thu/:MaCauThu', DbCtController.delete);

module.exports = router;
