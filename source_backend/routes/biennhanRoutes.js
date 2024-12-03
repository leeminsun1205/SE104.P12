const express = require('express');
const { getBiennhan, createBiennhan, deleteBiennhan } = require('../controllers/biennhanController');
const router = express.Router();

router.get('/', getBiennhan);
router.post('/', createBiennhan);
router.delete('/:MaCauThu', deleteBiennhan);

module.exports = router;