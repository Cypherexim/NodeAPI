const express = require('express');
const router = express.Router();
const { check, body } = require('express-validator/check');
const firstController = require('../../src/controllers/firstController');
const importController = require('../controllers/import');
const accountController = require('../controllers/accountController');
const countryController = require('../controllers/countryController');
const indiaImportController = require('../controllers/Import/indiaController');
const indiaExportController = require('../controllers/Export/indiaController');

// first Controller
router.get('/getUsers', firstController.getUsers);
router.post('/addUser', check('email').isEmail(), firstController.createtUser);

//Normal Controller
router.get('/fetchImport', importController.getimport);
router.get('/gethscode', importController.getHscode);

//Import controller
router.get('/getIndiaImports', check('fromDate').notEmpty().isDate(), check('toDate').notEmpty().isDate(), indiaImportController.getindiaImport);
//Export controller
router.get('/getIndiaExports', check('fromDate').notEmpty().isDate(), check('toDate').notEmpty().isDate(), indiaExportController.getindiaExport);

// Account Controller
router.post('/signup', check('FullName').notEmpty(), check('CompanyName').notEmpty(), body('MobileNumber').isLength({ min: 10, max: 10 }).withMessage('Mobile Number should be of 10 digit.'), check('Password').notEmpty(), check('Email').isEmail(), accountController.createtUser);
router.post('/signin', check('Password').notEmpty(), check('Email').isEmail(), accountController.postLogin);

// Country Controller
router.get('/getContries', countryController.getCountries);
module.exports = router;