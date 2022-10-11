const express = require('express');
const router = express.Router();
const {check, body} = require('express-validator/check');
const firstController = require('../../src/controllers/firstController');
const importController = require('../controllers/import');
const accountController = require('../controllers/accountController');

// first Controller
router.get('/getUsers', firstController.getUsers);
router.post('/addUser',check('email').isEmail(), firstController.createtUser);

//Import Controller
router.get('/fetchImport', importController.getimport);
router.get('/getImports',check('fromDate').notEmpty().isDate(),check('toDate').notEmpty().isDate(), importController.getimportwithsearch);
router.get('/getExports',check('fromDate').notEmpty().isDate(),check('toDate').notEmpty().isDate(), importController.getexporttwithsearch);
router.get('/gethscode', importController.getHscode);

// Account Controller
router.post('/signup',check('FullName').notEmpty(),check('CompanyName').notEmpty(),body('MobileNumber').isLength({min:10, max:10}).withMessage('Mobile Number should be of 10 digit.'),check('Password').notEmpty(), check('Email').isEmail(), accountController.createtUser);
router.post('/signin',check('Password').notEmpty(), check('Email').isEmail(), accountController.postLogin);

module.exports = router;