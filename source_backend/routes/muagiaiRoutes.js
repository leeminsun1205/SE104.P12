const express = require('express');
const { getMuaGiai, createMuaGiai, deleteMuaGiai } = require('../controllers/MuaGiaiController');
const router = express.Router();

router.get('/', getMuaGiai);
router.post('/', createMuaGiai);
router.delete('/:MaCauThu', deleteMuaGiai);

module.exports = router;