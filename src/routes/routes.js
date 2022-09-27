const express = require('express');
const router = express.Router();
const {check} = require('express-validator/check');
const firstController = require('../../src/controllers/firstController');
const importController = require('../controllers/import');

router.get('/getUsers', firstController.getUsers);
router.post('/addUser',check('email').isEmail(), firstController.createtUser);
router.get('/fetchImport', importController.getimport);
router.get('/getImports',check('fromDate').notEmpty().isDate(),check('toDate').notEmpty().isDate(), importController.getimports);

module.exports = router;