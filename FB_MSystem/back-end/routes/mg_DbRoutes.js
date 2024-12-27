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

module.exports = router;
