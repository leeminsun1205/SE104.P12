const express = require('express');
const doiBongController = require('../controllers/doiBongController');

const router = express.Router();

router.get('/', doiBongController.getAll);
router.get('/:id', doiBongController.getById);
router.post('/', doiBongController.create);
router.put('/:id', doiBongController.update);
router.delete('/:id', doiBongController.delete);

module.exports = router;
