const express = require('express');
const mg_Db_CtController = require('../controllers/mg_Db_CtController');

const router = express.Router();

router.get('/mua-giai/:MaMuaGiai', mg_Db_CtController.getByMuaGiai); // Lấy danh sách đội bóng và cầu thủ theo mùa giải
router.get('/doi-bong/:MaDoiBong', mg_Db_CtController.getByDoiBong); // Lấy danh sách cầu thủ của đội bóng trong mùa giải
router.post('/', mg_Db_CtController.create); // Thêm liên kết mới
router.put('/:MaMuaGiai/:MaDoiBong/:MaCauThu', mg_Db_CtController.update); // Cập nhật liên kết
router.delete('/:MaMuaGiai/:MaDoiBong/:MaCauThu', mg_Db_CtController.delete); // Xóa liên kết

module.exports = router;
