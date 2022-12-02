const express = require('express');
const router = express.Router();
const { check, body } = require('express-validator');
const firstController = require('../../src/controllers/firstController');
const importController = require('../controllers/import');
const accountController = require('../controllers/accountController');
const countryController = require('../controllers/countryController');
const indiaImportController = require('../controllers/Import/indiaController');
const indiaExportController = require('../controllers/Export/indiaController');
const srilankaImportController = require('../controllers/Import/srilankaController');
const srilankaExportController = require('../controllers/Export/srilankaController');
const bangladeshImportController = require('../controllers/Import/bangladeshController');
const bangladeshExportController = require('../controllers/Export/bangladeshController');
const planController = require('../controllers/planController');

// first Controller
router.get('/getUsers', firstController.getUsers);
router.post('/addUser', check('email').isEmail(), firstController.createtUser);

//Normal Controller
router.get('/fetchImport', importController.getimport);
router.get('/gethscode', importController.getHscode);

//Import controller
router.get('/getIndiaImports', check('fromDate').notEmpty().isDate(), check('toDate').notEmpty().isDate(), indiaImportController.getindiaImport);
router.get('/getSrilankaImports', check('fromDate').notEmpty().isDate(), check('toDate').notEmpty().isDate(), srilankaImportController.getsrilankaImport);
router.get('/getBangladeshImports', check('fromDate').notEmpty().isDate(), check('toDate').notEmpty().isDate(), bangladeshImportController.getbangladeshImport);
//Export controller
router.get('/getIndiaExports', check('fromDate').notEmpty().isDate(), check('toDate').notEmpty().isDate(), indiaExportController.getindiaExport);
router.get('/getSrilankaExports', check('fromDate').notEmpty().isDate(), check('toDate').notEmpty().isDate(), srilankaExportController.getsrilankaExport);
router.get('/getBangladeshExports', check('fromDate').notEmpty().isDate(), check('toDate').notEmpty().isDate(), bangladeshExportController.getbangladeshExport);

// Account Controller
router.post('/signup', check('FullName').notEmpty(), check('CompanyName').notEmpty(), body('MobileNumber').isLength({ min: 10, max: 10 }).withMessage('Mobile Number should be of 10 digit.'), check('Password').notEmpty(), check('Email').isEmail(), accountController.createtUser);
router.post('/signin', check('Password').notEmpty(), check('Email').isEmail(), accountController.postLogin);

// Country Controller
router.get('/getContries', countryController.getCountries);

// Plan Controller
router.post('/addplan', check('PlanName').notEmpty(), planController.createPlan);

module.exports = router;