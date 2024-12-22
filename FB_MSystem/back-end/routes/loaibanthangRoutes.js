const express = require('express');
const LoaiBanThangController = require('../controllers/loaibanthangController');

const router = express.Router();

router.get('/', LoaiBanThangController.getAll); // Lấy danh sách loại bàn thắng
router.post('/', LoaiBanThangController.create); // Thêm loại bàn thắng mới
router.put('/:id', LoaiBanThangController.update); // Cập nhật loại bàn thắng
router.delete('/:id', LoaiBanThangController.delete); // Xóa loại bàn thắng

module.exports = router;
