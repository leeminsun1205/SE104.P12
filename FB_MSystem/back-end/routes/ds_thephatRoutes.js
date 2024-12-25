const express = require('express');
const ds_ThePhatController = require('../controllers/ds_ThePhatController');

const router = express.Router();

router.get('/vong-dau/:MaVongDau', ds_ThePhatController.getByVongDau); // Lấy danh sách thẻ phạt theo vòng đấu
router.get('/mua-giai/:MaMuaGiai', ds_ThePhatController.getByMuaGiai); // Lấy danh sách thẻ phạt theo mùa giải
router.put('/update', ds_ThePhatController.update);

module.exports = router;
