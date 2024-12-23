const express = require('express');
const mg_Db_CtController = require('../controllers/mg_Db_CtController');
const vongDauController = require('../controllers/vongDauController')
const router = express.Router();


router.get('/mua-giai/:MaMuaGiai/doi-bong', mg_Db_CtController.getByMuaGiai);
router.get('/mua-giai/:MaMuaGiai/doi-bong/:MaDoiBong/cau-thu', mg_Db_CtController.getByDoiBong);
router.post('/', mg_Db_CtController.create); // Thêm liên kết mới
router.put('/:MaMuaGiai/:MaDoiBong/:MaCauThu', mg_Db_CtController.update); // Cập nhật liên kết
router.delete('/:MaMuaGiai/:MaDoiBong/:MaCauThu', mg_Db_CtController.delete); // Xóa liên kết
router.post('/:maMuaGiai/vong-dau', vongDauController.createByMuaGiai);

module.exports = router;
