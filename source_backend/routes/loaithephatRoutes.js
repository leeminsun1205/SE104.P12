const express = require('express');
const router = express.Router();
const {
    getLoaiThePhat,
    createLoaiThePhat,
    updateLoaiThePhat,
    deleteLoaiThePhat,
} = require('../controllers/loaithephatController');

// Lấy tất cả loại thẻ phạt
router.get('/', getLoaiThePhat);

// Thêm loại thẻ phạt mới
router.post('/', createLoaiThePhat);

// Cập nhật loại thẻ phạt
router.put('/:MaLoaiThePhat', updateLoaiThePhat);

// Xóa loại thẻ phạt
router.delete('/:MaLoaiThePhat', deleteLoaiThePhat);

module.exports = router;
