const express = require('express');
const router = express.Router();
const DangNhapController = require('../controllers/dangNhapController'); // Đảm bảo đường dẫn đúng

// Lấy tất cả thông tin đăng nhập
router.get('/', DangNhapController.getAll);

// Lấy thông tin đăng nhập theo MaNguoiDung
router.get('/:MaNguoiDung/email/:TenDangNhap', DangNhapController.getById);

// Tạo mới thông tin đăng nhập
router.post('/', DangNhapController.create);

// Route xử lý đăng nhập
router.post('/login', DangNhapController.login);

router.post('/signup', DangNhapController.register);

module.exports = router;