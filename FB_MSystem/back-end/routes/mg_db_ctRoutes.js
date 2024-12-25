const express = require('express');
const mg_Db_CtController = require('../controllers/mg_Db_CtController');
const router = express.Router();


router.get('/mua-giai/:MaMuaGiai/doi-bong', mg_Db_CtController.getByMuaGiai);
router.get('/mua-giai/:MaMuaGiai/doi-bong/:MaDoiBong/cau-thu', mg_Db_CtController.getByDoiBong);
router.post('/mua-giai/:MaMuaGiai/doi-bong/:MaDoiBong/cau-thu/:MaCauThu', mg_Db_CtController.create); // Thêm liên kết mới (Chọn mùa giải, xong chọn đội, xong chọn cầu thủ nào thi đấu)
router.post('/mua-giai/:MaMuaGiai/doi-bong/:MaDoiBong', mg_Db_CtController.addTeamToSeason); // Thêm đội bóng vào mùa giải

router.put('/:MaMuaGiai/:MaDoiBong/:MaCauThu', mg_Db_CtController.update); // Cập nhật liên kết
router.delete('/:MaMuaGiai/:MaDoiBong/:MaCauThu', mg_Db_CtController.delete); // Xóa liên kết


module.exports = router;
