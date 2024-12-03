const express = require('express');
const { getMg_Db_Ct, createMg_Db_Ct, deleteMg_Db_Ct } = require('../controllers/mg_db_ctController');
const router = express.Router();

router.get('/', getMg_Db_Ct);
router.post('/', createMg_Db_Ct);
router.delete('/:MaCauThu', deleteMg_Db_Ct);

module.exports = router;