const express = require('express');
const ThanhTichController = require('../controllers/thanhtichController');

const router = express.Router();

router.get('/muagiai/:MaMuaGiai', ThanhTichController.getByMuaGiai); // Lấy thành tích theo mùa giải
router.get('/doibong/:MaDoiBong', ThanhTichController.getByDoiBong); // Lấy thành tích của đội bóng

module.exports = router;
