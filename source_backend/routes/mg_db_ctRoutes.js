const express = require('express');
const { getMG_DB_CT, createMG_DB_CT, deleteMG_DB_CT } = require('../controllers/MG_DB_CTController');
const router = express.Router();

router.get('/', getMG_DB_CT);
router.post('/', createMG_DB_CT);
router.delete('/:MaCauThu', deleteMG_DB_CT);

module.exports = router;