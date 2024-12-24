const express = require('express');
const thanhTichController = require('../controllers/thanhTichController');

const router = express.Router();

router.get('/mua-giai/:MaMuaGiai', thanhTichController.getByMuaGiai); // Lấy thành tích theo mùa giải
router.get('/doi-bong/:MaDoiBong', thanhTichController.getByDoiBong); // Lấy thành tích của đội bóng
router.post('/', thanhTichController.create);
router.put('/update/:macauthu/:mavongdau', thanhTichController.update);
router.delete('/delete/:macauthu/:mavongdau', thanhTichController.delete);


module.exports = router;
