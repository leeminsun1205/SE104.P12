const express = require('express');
const loaiUuTienController = require('../controllers/loaiUuTienController');

const router = express.Router();

router.get('/', loaiUuTienController.getAll); // Lấy danh sách loại ưu tiên
router.post('/', loaiUuTienController.create); // Thêm loại ưu tiên
router.put('/:id', loaiUuTienController.update); // Cập nhật loại ưu tiên
router.delete('/:id', loaiUuTienController.delete); // Xóa loại ưu tiên

module.exports = router;
