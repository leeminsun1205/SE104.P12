const express = require('express');
const {
    getCauThu,
    createCauThu,
    deleteCauThu,
    updateCauThu, 
} = require('../controllers/cauthuController');

const router = express.Router();

router.get('/', getCauThu);

router.post('/', createCauThu);

router.delete('/:MaCauThu', deleteCauThu);

router.put('/:MaCauThu', updateCauThu);

module.exports = router;
