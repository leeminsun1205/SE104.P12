
const express = require('express');
const bangXepHangController = require('../controllers/bangXepHangController');

const router = express.Router();

router.get('/mua-giai/:MaMuaGiai', bangXepHangController.getByMuaGiai); // Lấy bảng xếp hạng theo mùa giải
router.get('/', bangXepHangController.getAll); // Lấy bảng xếp hạng theo mùa giải
router.get('/team-positions', bangXepHangController.getTeamPositions);
// New route for team positions
router.get('/doi-bong/xep-hang', bangXepHangController.getTeamPositions);

module.exports = router;