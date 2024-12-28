const express = require('express');
const thePhatController = require('../controllers/thePhatController');

const router = express.Router();

router.get('/', thePhatController.getAll); // Lấy danh sách tất cả thẻ phạt
router.get('/tran-dau/:MaTranDau', thePhatController.getByTranDau); // Lấy thẻ phạt theo trận đấu
router.get('/:MaTranDau/:id', thePhatController.getByTranDauandID);
router.post('/', thePhatController.create); // Thêm thẻ phạt mới
// Trong file routes/thePhatRoutes.js
router.put('/:MaTranDau/:id', thePhatController.putByTranDauandID);
router.post('/tran-dau/:MaTranDau', thePhatController.postByTranDau);
router.delete('/:id', thePhatController.delete); // Xóa thẻ phạt
router.delete('/:MaTranDau/:id', thePhatController.deleteByTranDauandID);

module.exports = router;
