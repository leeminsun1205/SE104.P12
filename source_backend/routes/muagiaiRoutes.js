const express = require('express');
const { getMuagiai, createMuagiai, deleteMuagiai } = require('../controllers/muagiaiController');
const router = express.Router();

router.get('/', getMuagiai);
router.post('/', createMuagiai);
router.delete('/:MaCauThu', deleteMuagiai);

module.exports = router;