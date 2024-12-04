const express = require('express');
const { getBienNhan, createBienNhan, deleteBienNhan } = require('../controllers/BienNhanController');
const router = express.Router();

router.get('/', getBienNhan);
router.post('/', createBienNhan);
router.delete('/:MaCauThu', deleteBienNhan);

module.exports = router;