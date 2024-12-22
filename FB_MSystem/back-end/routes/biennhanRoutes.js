const express = require('express');
const bienNhanController = require('../controllers/bienNhanController');

const router = express.Router();

router.get('/', bienNhanController.getAll); // Lấy danh sách tất cả biên nhận
router.get('/doi-bong/:MaDoiBong', bienNhanController.getByDoiBong); // Lấy danh sách biên nhận của đội bóng
router.post('/', bienNhanController.create); // Thêm biên nhận mới
router.put('/:id', bienNhanController.update)
router.delete('/:id', bienNhanController.delete); // Xóa biên nhận

module.exports = router;
