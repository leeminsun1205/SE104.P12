const express = require('express');
const BienNhanController = require('../controllers/biennhanController');

const router = express.Router();

router.get('/', BienNhanController.getAll); // Lấy danh sách tất cả biên nhận
router.get('/doibong/:MaDoiBong', BienNhanController.getByDoiBong); // Lấy danh sách biên nhận của đội bóng
router.post('/', BienNhanController.create); // Thêm biên nhận mới
router.delete('/:id', BienNhanController.delete); // Xóa biên nhận

module.exports = router;
