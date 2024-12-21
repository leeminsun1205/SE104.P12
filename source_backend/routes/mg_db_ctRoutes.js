const express = require('express');
const MgDbCtController = require('../controllers/mg_db_ctController');

const router = express.Router();

router.get('/muagiai/:MaMuaGiai', MgDbCtController.getByMuaGiai); // Lấy danh sách đội bóng và cầu thủ theo mùa giải
router.get('/doibong/:MaDoiBong', MgDbCtController.getByDoiBong); // Lấy danh sách cầu thủ của đội bóng trong mùa giải
router.post('/', MgDbCtController.create); // Thêm liên kết mới
router.put('/:MaMuaGiai/:MaDoiBong/:MaCauThu', MgDbCtController.update); // Cập nhật liên kết
router.delete('/:MaMuaGiai/:MaDoiBong/:MaCauThu', MgDbCtController.delete); // Xóa liên kết

module.exports = router;
