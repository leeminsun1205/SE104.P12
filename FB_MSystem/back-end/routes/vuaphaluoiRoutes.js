const express = require('express');
const vuaPhaLuoiController = require('../controllers/vuaPhaLuoiController');

const router = express.Router();

router.get('/mua-giai/:MaMuaGiai', vuaPhaLuoiController.getByMuaGiai); 

module.exports = router;
