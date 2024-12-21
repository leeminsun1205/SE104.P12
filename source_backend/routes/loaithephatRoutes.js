const express = require('express');
const LoaiThePhatController = require('../controllers/loaithephatController');

const router = express.Router();

router.get('/', LoaiThePhatController.getAll); // Lấy danh sách loại thẻ phạt
router.post('/', LoaiThePhatController.create); // Thêm loại thẻ phạt mới
router.put('/:id', LoaiThePhatController.update); // Cập nhật loại thẻ phạt
router.delete('/:id', LoaiThePhatController.delete); // Xóa loại thẻ phạt

module.exports = router;
