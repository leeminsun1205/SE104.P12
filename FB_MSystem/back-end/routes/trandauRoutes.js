const express = require('express');
const tranDauController = require('../controllers/tranDauController');

const router = express.Router();

router.get('/', tranDauController.getAll);
router.get('/:MaTranDau', tranDauController.getById);
router.get('/mua-giai/:MaMuaGiai', tranDauController.getByMuaGiai);
router.get('/doi-bong/:MaDoiBong', tranDauController.getByDoiBong);

router.post('/', tranDauController.create);
// router.post('/:maMuaGiai', tranDauController.createMatchesBySeason);

router.put('/:id', tranDauController.update);
router.delete('/:id', tranDauController.delete);

module.exports = router;