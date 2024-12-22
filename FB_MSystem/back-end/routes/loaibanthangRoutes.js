const express = require('express');
const loaiBanThangController = require('../controllers/loaiBanThangController');

const router = express.Router();

router.get('/', loaiBanThangController.getAll); // Lấy danh sách loại bàn thắng
router.post('/', loaiBanThangController.create); // Thêm loại bàn thắng mới
router.put('/:id', loaiBanThangController.update); // Cập nhật loại bàn thắng
router.delete('/:id', loaiBanThangController.delete); // Xóa loại bàn thắng

module.exports = router;
