const express = require('express');
const ThePhatController = require('../controllers/thephatController');

const router = express.Router();

router.get('/', ThePhatController.getAll); // Lấy danh sách tất cả thẻ phạt
router.get('/trandau/:MaTranDau', ThePhatController.getByTranDau); // Lấy thẻ phạt theo trận đấu
router.post('/', ThePhatController.create); // Thêm thẻ phạt mới
router.delete('/:id', ThePhatController.delete); // Xóa thẻ phạt

module.exports = router;
