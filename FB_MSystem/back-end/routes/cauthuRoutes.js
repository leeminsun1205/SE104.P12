const express = require('express');
const cauThuController = require('../controllers/cauThuController');

const router = express.Router();

router.get('/', cauThuController.getAll); 
router.get('/:id', cauThuController.getById); 
router.post('/', cauThuController.create); 
router.put('/:id', cauThuController.update); 
router.delete('/:id', cauThuController.delete); 

module.exports = router;
