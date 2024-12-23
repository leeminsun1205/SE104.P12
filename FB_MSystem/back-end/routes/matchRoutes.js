const express = require('express');
const router = express.Router();
const matchController = require('../controllers/matchController');

// Route phát sinh trận đấu cho mùa giải
router.post('/:maMuaGiai/tran-dau', matchController.createMatchesBySeason);

module.exports = router;