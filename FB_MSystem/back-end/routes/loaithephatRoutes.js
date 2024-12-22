const express = require('express');
const loaiThePhatController = require('../controllers/loaiThePhatController');

const router = express.Router();

router.get('/', loaiThePhatController.getAll); // Lấy danh sách loại thẻ phạt
router.post('/', loaiThePhatController.create); // Thêm loại thẻ phạt mới
router.put('/:id', loaiThePhatController.update); // Cập nhật loại thẻ phạt
router.delete('/:id', loaiThePhatController.delete); // Xóa loại thẻ phạt

module.exports = router;
