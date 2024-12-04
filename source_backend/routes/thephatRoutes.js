const express = require('express');
const router = express.Router();
const {
    getThePhat,
    createThePhat,
    updateThePhat,
    deleteThePhat,
} = require('../controllers/thephatController');

// Lấy tất cả thẻ phạt
router.get('/', getThePhat);

// Thêm thẻ phạt mới
router.post('/', createThePhat);

// Cập nhật thẻ phạt
router.put('/:MaThePhat', updateThePhat);

// Xóa thẻ phạt
router.delete('/:MaThePhat', deleteThePhat);

module.exports = router;
