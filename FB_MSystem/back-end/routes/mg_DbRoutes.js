const express = require('express');
const MgDbController = require('../controllers/mg_DbController');
const router = express.Router();

// Lấy danh sách đội bóng theo mùa giải
router.get('/mua-giai/:MaMuaGiai/doi-bong', MgDbController.getByMuaGiai);
router.get('/mua-giai/:MaMuaGiai/doi-bong/:MaDoiBong', MgDbController.getCauThuByMuaGiaiAndDoiBong);
// Thêm liên kết mới giữa mùa giải và đội bóng
router.post('/create', MgDbController.create);

// Thêm nhiều liên kết giữa mùa giải và đội bóng
router.post('/createMany', MgDbController.createMany);

// Cập nhật liên kết giữa mùa giải và đội bóng
router.put('/:MaMuaGiai/:MaDoiBong', MgDbController.update);

// Xóa liên kết giữa mùa giải và đội bóng
router.delete('/:MaMuaGiai/:MaDoiBong', MgDbController.delete);

// Xóa cầu thủ khỏi đội trong một mùa giải cụ thể
router.delete('/mua-giai/:MaMuaGiai/doi-bong/:MaDoiBong/cau-thu/:MaCauThu', MgDbController.deleteCauThuFromDoiBongMuaGiai);

module.exports = router;