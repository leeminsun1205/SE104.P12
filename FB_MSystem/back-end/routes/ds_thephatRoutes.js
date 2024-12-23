const express = require('express');
const ds_ThePhatController = require('../controllers/ds_ThePhatController');

const router = express.Router();

router.get('/vong-dau/:MaVongDau', ds_ThePhatController.getByVongDau); // Lấy danh sách thẻ phạt theo vòng đấu
router.get('/mua-giai/:MaMuaGiai', ds_ThePhatController.getByMuaGiai); // Lấy danh sách thẻ phạt theo mùa giải
router.post('/', ds_ThePhatController.create);
router.put('/update/:macauthu/:mavongdau', ds_ThePhatController.update);
router.delete('/delete/:macauthu/:mavongdau', ds_ThePhatController.delete);

module.exports = router;
