const express = require('express');
const thePhatController = require('../controllers/thePhatController');

const router = express.Router();

router.get('/', thePhatController.getAll); // Lấy danh sách tất cả thẻ phạt
router.get('/tran-dau/:MaTranDau', thePhatController.getByTranDau); // Lấy thẻ phạt theo trận đấu
router.post('/', thePhatController.create); // Thêm thẻ phạt mới
router.delete('/:id', thePhatController.delete); // Xóa thẻ phạt

module.exports = router;
