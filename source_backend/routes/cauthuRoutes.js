const express = require('express');
const CauThuController = require('../controllers/cauthuController');

const router = express.Router();

router.get('/', CauThuController.getAll); 
router.get('/:id', CauThuController.getById); 
router.post('/', CauThuController.create); 
router.put('/:id', CauThuController.update); 
router.delete('/:id', CauThuController.delete); 

module.exports = router;
