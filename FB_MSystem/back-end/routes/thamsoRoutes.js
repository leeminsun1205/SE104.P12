const express = require('express');
const ThamSoController = require('../controllers/thamsoController');

const router = express.Router();

router.get('/', ThamSoController.getAll); // Lấy danh sách tham số
router.put('/', ThamSoController.update); // Cập nhật tham số

module.exports = router;
