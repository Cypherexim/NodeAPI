const express = require('express');
const router = express.Router();
const { check, body } = require('express-validator');
const config = require('../utils/config');
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
const ethiopiaImportController = require('../controllers/Import/ethiopiaController');
const ethiopiaExportController = require('../controllers/Export/ethiopiaController');
const chileImportController = require('../controllers/Import/chileController');
const chileExportController = require('../controllers/Export/chileController');
const philipImportController = require('../controllers/Import/philipController');
const philipExportController = require('../controllers/Export/philipController');
const planController = require('../controllers/planController');
const fileController = require('../controllers/fileController');
const downloadController = require('../controllers/downloadController');
const rolesController = require('../controllers/rolesController');
const turkeyExportController = require('../controllers/Export/turkeyController');
const turkeyImportController = require('../controllers/Import/turkeyController');
const russiaExportController = require('../controllers/Export/russiaController');
const russiaImportController = require('../controllers/Import/russiaController');
const analysisController = require('../controllers/analysisController');
const kenyaImportController = require('../controllers/Import/kenyaController');
const lesothoImportController = require('../controllers/Import/lesothoController');
const mexicoImportController = require('../controllers/Import/mexicoController');
const nigeriaImportController = require('../controllers/Import/nigeriaController');
const usaImportController = require('../controllers/Import/usaController');
const vietnamImportController = require('../controllers/Import/vietnamController');
const kenyaExportController = require('../controllers/Export/kenyaController');
const lesothoExportController = require('../controllers/Export/lesothoController');
const mexicoExportController = require('../controllers/Export/mexicoController');
const nigeriaExportController = require('../controllers/Export/nigeriaController');
const usaExportController = require('../controllers/Export/usaController');
const vietnamExportController = require('../controllers/Export/vietnamController');
const companyProfileController = require('../controllers/companyProfileController');
const brazilImportController = require('../controllers/Import/brazilController');
const brazilExportController = require('../controllers/Export/brazilController');
const columbiaImportController = require('../controllers/Import/columbiaController');
const columbiaExportController = require('../controllers/Export/columbiaController');
const paraguayExportController = require('../controllers/Export/paraguayController');
const peruExportController = require('../controllers/Export/peruController');
const ugandaExportController = require('../controllers/Export/ugandaController');
const pakistanExportController = require('../controllers/Export/pakistanController');
const namibiaExportController = require('../controllers/Export/nambiaController');
const ecuadorExportController = require('../controllers/Export/ecuadorController');
const ivorycostExportController = require('../controllers/Export/ivorycostController');
const ivorycostImportController = require('../controllers/Import/ivorycostController');
const ecuadorImportController = require('../controllers/Import/ecuadorController');
const namibiaImportController = require('../controllers/Import/namibiaController');

router.post('/signup', check('FullName').notEmpty(), check('CompanyName').notEmpty(), body('MobileNumber').isLength({ min: 10, max: 10 }).withMessage('Mobile Number should be of 10 digit.'), check('Password').notEmpty(), check('Email').isEmail(), accountController.createUser);
router.post('/signin', check('Password').notEmpty(), check('Email').isEmail(), accountController.postLogin);
router.post('/resetpassword', accountController.resetPassword);

var jwt = require('jsonwebtoken');

router.use(function (req, res, next) {
    var token = req.headers['x-access-token'];
    console.log(token);
    if (token) {
        jwt.verify(token, config.TOKEN_KEY,
            {
                algorithm: 'HS256'

            }, function (err, decoded) {
                if (err) {
                    let errordata = {
                        message: err.message,
                        expiredAt: err.expiredAt
                    };
                    console.log(errordata);
                    return res.status(401).json({
                        message: 'Unauthorized Access'
                    });
                }
                req.decoded = decoded;
                console.log(decoded);
                next();
            });
    } else {
        return res.status(403).json({
            message: 'Token required to access this API.'
        });
    }
});
// first Controller
router.get('/getUsers', firstController.getUsers);
router.post('/addUser', check('email').isEmail(), firstController.createtUser);

//Normal Controller
router.get('/fetchImport', importController.getimport);
router.get('/gethscode', importController.getHscode);
router.get('/getSideFilterAccess', importController.getSideFilterAccess);
router.get('/getAllSideFilterAccess', importController.getAllSideFilterAccess);
router.get('/getImportExportList', importController.getImportExportList);
router.get('/getImportList', importController.getImportList);
router.get('/getExportList', importController.getExportList);
router.post('/addUpdateAccess', importController.addupdateAccessSideFilter);
router.get('/getWorkSpace', importController.getWorkspace);
router.post('/addWorkspace', importController.addWorkspace);
router.post('/deleteWorkspace', importController.deleteWorkspace);
router.get('/getDownloadCost', check('CountryCode').notEmpty(), importController.getDownloadCost);
router.get('/gettotalrecords', importController.getTotalRecord);
router.post('/getSideFilterData', importController.getListofSidefilterdata);
router.get('/getProductDesc', importController.getProductDesc);
router.get('/getimporterexportindia', importController.getimporterexportindia)
router.get('/getimporterimportindia', importController.getimporterimportindia)
router.get('/getexporterexportindia', importController.getexporterexportindia)
router.get('/getexporterimportindia', importController.getexporterimportindia)
router.post('/getfirstSideFilterData', importController.getfirstListofSidefilterdata);
router.post('/getsecondSideFilterData', importController.getsecondListofSidefilterdata);
router.post('/getthirdSideFilterData', importController.getthirdListofSidefilterdata);
router.post('/getfourthSideFilterData', importController.getfourthListofSidefilterdata);
router.post('/getfifthSideFilterData', importController.getfifthListofSidefilterdata);
router.post('/getimportSideFilterData', importController.getImportListofSidefilterdata);
router.post('/getexportSideFilterData', importController.getExportListofSidefilterdata);
router.post('/getdatabyalphabet', importController.getexportlistbyAlphabet);
router.get('/getcommonimport', importController.getcommonimportlist);
router.get('/getcommonexport', importController.getcommonexportlist);
router.get('/getalertmessage',importController.getAlertMessage);
router.post('/addnotification', importController.addnotification);
router.get('/getnotification', importController.getnotification);
router.post('/getcount', importController.getcounts);
router.post('/updateuserpreferences', importController.updateUserPreference);
router.post('/updatealertmessage',importController.updateAlertMessage);
router.get('/getcountries',importController.getallcountries);
router.post('/addlog',importController.adduserlog);
router.get('/getlogs', importController.getUserlogs);

//Import controller
router.post('/getIndiaImports', check('fromDate').notEmpty().isDate(), check('toDate').notEmpty().isDate(), indiaImportController.getindiaImport);
router.post('/getSrilankaImports', check('fromDate').notEmpty().isDate(), check('toDate').notEmpty().isDate(), srilankaImportController.getsrilankaImport);
router.post('/getBangladeshImports', check('fromDate').notEmpty().isDate(), check('toDate').notEmpty().isDate(), bangladeshImportController.getbangladeshImport);
router.post('/getEthiopiaImports', check('fromDate').notEmpty().isDate(), check('toDate').notEmpty().isDate(), ethiopiaImportController.getethiopiaImport);
router.post('/getChileImports', check('fromDate').notEmpty().isDate(), check('toDate').notEmpty().isDate(), chileImportController.getchileImport);
router.post('/getPhilipImports', check('fromDate').notEmpty().isDate(), check('toDate').notEmpty().isDate(), philipImportController.getphilipImport);
router.post('/getTurkeyImports', check('fromDate').notEmpty().isDate(), check('toDate').notEmpty().isDate(), turkeyImportController.getturkeyImport);
router.post('/getRussiaImports', check('fromDate').notEmpty().isDate(), check('toDate').notEmpty().isDate(), russiaImportController.getrussiaImport);
router.post('/getKenyaImports', check('fromDate').notEmpty().isDate(), check('toDate').notEmpty().isDate(), kenyaImportController.getkenyaImport);
router.post('/getLesothoImports', check('fromDate').notEmpty().isDate(), check('toDate').notEmpty().isDate(), lesothoImportController.getlesothoImport);
router.post('/getMexicoImports', check('fromDate').notEmpty().isDate(), check('toDate').notEmpty().isDate(), mexicoImportController.getmexicoImport);
router.post('/getNigeriaImports', check('fromDate').notEmpty().isDate(), check('toDate').notEmpty().isDate(), nigeriaImportController.getnigeriaImport);
router.post('/getUsaImports', check('fromDate').notEmpty().isDate(), check('toDate').notEmpty().isDate(), usaImportController.getusaImport);
router.post('/getVietnamImports', check('fromDate').notEmpty().isDate(), check('toDate').notEmpty().isDate(), vietnamImportController.getvietnamImport);
router.post('/getBrazilImports', check('fromDate').notEmpty().isDate(), check('toDate').notEmpty().isDate(), brazilImportController.getbrazilImport);
router.post('/getColumbiaImports', check('fromDate').notEmpty().isDate(), check('toDate').notEmpty().isDate(), columbiaImportController.getcolumbiaImport);
router.post('/getIvorycostImports', check('fromDate').notEmpty().isDate(), check('toDate').notEmpty().isDate(), ivorycostImportController.getivorycostImport);
router.post('/getEcuadorImports', check('fromDate').notEmpty().isDate(), check('toDate').notEmpty().isDate(), ecuadorImportController.getecuadorImport);
router.post('/getNamibiaImports', check('fromDate').notEmpty().isDate(), check('toDate').notEmpty().isDate(), namibiaImportController.getnamibiaImport);


//Export controller
router.post('/getIndiaExports', check('fromDate').notEmpty().isDate(), check('toDate').notEmpty().isDate(), indiaExportController.getindiaExport);
router.post('/getSrilankaExports', check('fromDate').notEmpty().isDate(), check('toDate').notEmpty().isDate(), srilankaExportController.getsrilankaExport);
router.post('/getBangladeshExports', check('fromDate').notEmpty().isDate(), check('toDate').notEmpty().isDate(), bangladeshExportController.getbangladeshExport);
router.post('/getEthiopiaExports', check('fromDate').notEmpty().isDate(), check('toDate').notEmpty().isDate(), ethiopiaExportController.getethopiaExport);
router.post('/getChileExports', check('fromDate').notEmpty().isDate(), check('toDate').notEmpty().isDate(), chileExportController.gethchileExport);
router.post('/getPhilipExports', check('fromDate').notEmpty().isDate(), check('toDate').notEmpty().isDate(), philipExportController.getphilipExport);
router.post('/getTurkeyExports', check('fromDate').notEmpty().isDate(), check('toDate').notEmpty().isDate(), turkeyExportController.getturkeyExport);
router.post('/getRussiaExports', check('fromDate').notEmpty().isDate(), check('toDate').notEmpty().isDate(), russiaExportController.getrussiaExport);
router.post('/getKenyaExports', check('fromDate').notEmpty().isDate(), check('toDate').notEmpty().isDate(), kenyaExportController.getkenyaExport);
router.post('/getLesothoExports', check('fromDate').notEmpty().isDate(), check('toDate').notEmpty().isDate(), lesothoExportController.getlesothoExport);
router.post('/getMexicoExports', check('fromDate').notEmpty().isDate(), check('toDate').notEmpty().isDate(), mexicoExportController.getmexicoExport);
router.post('/getNigeriaExports', check('fromDate').notEmpty().isDate(), check('toDate').notEmpty().isDate(), nigeriaExportController.getnigeriaExport);
router.post('/getUsaExports', check('fromDate').notEmpty().isDate(), check('toDate').notEmpty().isDate(), usaExportController.getusaExport);
router.post('/getVietnamExports', check('fromDate').notEmpty().isDate(), check('toDate').notEmpty().isDate(), vietnamExportController.getvietnamExport);
router.post('/getBrazilExports', check('fromDate').notEmpty().isDate(), check('toDate').notEmpty().isDate(), brazilExportController.getbrazilExport);
router.post('/getColumbiaExports', check('fromDate').notEmpty().isDate(), check('toDate').notEmpty().isDate(), columbiaExportController.getcolumbiaExport);
router.post('/getParaguayExports', check('fromDate').notEmpty().isDate(), check('toDate').notEmpty().isDate(), paraguayExportController.getparaguayExport);
router.post('/getPeruExports', check('fromDate').notEmpty().isDate(), check('toDate').notEmpty().isDate(), peruExportController.getperuExport);
router.post('/getUgandaExports', check('fromDate').notEmpty().isDate(), check('toDate').notEmpty().isDate(), ugandaExportController.getugandaExport);
router.post('/getPakistanExports', check('fromDate').notEmpty().isDate(), check('toDate').notEmpty().isDate(), pakistanExportController.getpakistanExport);
router.post('/getNamibiaExports', check('fromDate').notEmpty().isDate(), check('toDate').notEmpty().isDate(), namibiaExportController.getnamibiaExport);
router.post('/getEcuadorExports', check('fromDate').notEmpty().isDate(), check('toDate').notEmpty().isDate(), ecuadorExportController.getecuadorExport);
router.post('/getIvorycostExports', check('fromDate').notEmpty().isDate(), check('toDate').notEmpty().isDate(), ivorycostExportController.getivorycostExport);

// Account Controller
router.get('/getAccountDetails', accountController.getAccountDetails);
router.post('/addUserAdmin', check('FullName').notEmpty(), check('CompanyName').notEmpty(), body('MobileNumber').isLength({ min: 10, max: 10 }).withMessage('Mobile Number should be of 10 digit.'), check('Password').notEmpty(), check('Email').isEmail(), accountController.addUserByAdmin);
router.post('/updateUserAdmin', check('FullName').notEmpty(), check('CompanyName').notEmpty(), body('MobileNumber').isLength({ min: 10, max: 10 }).withMessage('Mobile Number should be of 10 digit.'), check('Email').isEmail(), accountController.updateUserByAdmin);
router.get('/getAllUserList', accountController.getAllUserlist);
router.post('/changePassword', check('NewPassword').notEmpty(), check('CurrentPassword').notEmpty(), check('Email').isEmail(), accountController.changePassword);
router.post('/enabledisableuser', accountController.enabledisableuser);
router.get('/getUserslistByParentId', accountController.getuserlistbyParentId);


// Country Controller
router.get('/getContries', countryController.getCountries);
router.get('/getAllContries', countryController.getCountrieswithoutdate);
router.post('/addCountry', countryController.addCountry);
router.post('/updateCountry', countryController.updateCountry);
router.get('/getlatestdate', countryController.getlatestDate);
router.post('/addimporteddatahistory', countryController.addDataHistory);

// Plan Controller
router.post('/addplan', check('PlanName').notEmpty(), planController.createPlan);
router.get('/getallplans', planController.getPlanList);

//File Controller
router.post('/addFiles', fileController.uploadFiletoS3);

// Roles Controller
router.get('/getAllRoles', rolesController.getRoleList);
router.get('/getRolesAccessById', rolesController.getAccessByRoleId);

// Download controller

router.post('/savedownloadworkspace', downloadController.saveDownload);
router.get('/getdownloadworkspace', downloadController.getDownloadworkspace)
router.post('/getdownloadData', downloadController.getdownloaddata);
router.post('/generatedownloadfiles', downloadController.generateDownloadbigfilesforalluser);
router.post('/generatedownloadbigfiles', downloadController.generateDownloadbigfilesforalluser);
router.post('/sharedownloadtransaction', downloadController.sharedownloadfile);

// Analysis Controller

router.post('/getAnalysisReport', analysisController.getAnalysisData);
router.get('/getwhatstrending', analysisController.getWhatsTrending);

// Company Profile Controller
router.post('/getCompanyprofile', companyProfileController.getcompanyprofile);

module.exports = router;