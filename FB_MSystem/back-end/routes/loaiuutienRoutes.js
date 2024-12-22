const express = require('express');
const LoaiUuTienController = require('../controllers/loaiuutienController');

const router = express.Router();

router.get('/', LoaiUuTienController.getAll); // Lấy danh sách loại ưu tiên
router.post('/', LoaiUuTienController.create); // Thêm loại ưu tiên
router.put('/:id', LoaiUuTienController.update); // Cập nhật loại ưu tiên
router.delete('/:id', LoaiUuTienController.delete); // Xóa loại ưu tiên

module.exports = router;
