const express = require('express');
const router = express.Router();
const {
    getThamSo,
    createThamSo,
    updateThamSo,
    deleteThamSo,
} = require('../controllers/thamsoController');

// Lấy tất cả tham số
router.get('/', getThamSo);

// Thêm tham số mới
router.post('/', createThamSo);

// Cập nhật tham số
router.put('/:id', updateThamSo);

// Xóa tham số
router.delete('/:id', deleteThamSo);

module.exports = router;