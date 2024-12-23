const express = require('express');
const muaGiaiController = require('../controllers/muaGiaiController');


const router = express.Router();

router.get('/', muaGiaiController.getAll); // Lấy danh sách tất cả mùa giải
router.get('/:id', muaGiaiController.getById); // Lấy mùa giải theo ID
router.post('/', muaGiaiController.create); // Thêm mùa giải mới
router.put('/:id', muaGiaiController.update); // Cập nhật mùa giải
router.delete('/:id', muaGiaiController.delete); // Xóa mùa giải


module.exports = router;
