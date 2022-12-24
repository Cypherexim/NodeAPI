const { response } = require('express');
const db = require('../../src/utils/database');
const { validationResult } = require('express-validator');
const { success, error, validation } = require('../../src/utils/response');
const query = require('../../src/sql/queries');
const utility = require('../utils/utility');


// to get import data
exports.getimport = async (req, res) => {
    //db.connect();
    try {
        db.query(query.get_import_by_recordId, [2955314], (error, results) => {
            return res.status(200).json(success("Ok", results.rows, res.statusCode));
        })
    } catch (err) {
        return res.status(500).json(error(err, res.statusCode));
    };
    //db.end;
}

// to get import data
// exports.getimports = async (req, res) => {
//     try {
//         db.query(query.get_import, (error, results) => {
//             return res.status(200).json(success("Ok", results.rows, res.statusCode));
//         })
//     } catch (err) {
//         return res.status(500).json(error(err, res.statusCode));
//     };
//     //db.end;
// }

// to get import data
exports.getimports = async (req, res) => {
    //db.connect();
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            err = [];
            errors.errors.forEach(element => {
                err.push({ field: element.param, message: element.msg });
            });
            return res.status(422).json(validation(err));
        }
        const { fromDate, toDate, HSCODE, HSCodeDesc, Importer_Name, EXPORTER_NAME } = req.body;
        db.query(query.get_import_search, [fromDate, toDate, `%${HSCODE}%`, `%${HSCodeDesc}%`, `%${Importer_Name}%`, `%${EXPORTER_NAME}%`], (error, results) => {
            return res.status(200).json(success("Ok", results.rows, res.statusCode));
        })
    } catch (err) {
        return res.status(500).json(error(err, res.statusCode));
    };
    //db.end;
}

// to get import with search data
exports.getimportwithsearch = async (req, res) => {
    //db.connect();
    try {
        const { fromDate, toDate, HSCODE, HSCodeDesc, Importer_Name, EXPORTER_NAME } = req.query;
        let params = []

        if (fromDate != '' && fromDate != undefined) {
            params.push(utility.generateParams("Date", ">=", fromDate))
        }
        if (toDate != '' && toDate != undefined) {
            params.push(utility.generateParams("Date", "<=", toDate))
        }
        if (HSCODE != '' && HSCODE != undefined) {
            params.push(utility.generateParams("HSCODE", "%_%", HSCODE))
        }
        if (HSCodeDesc != '' && HSCodeDesc != undefined) {
            params.push(utility.generateParams("HSCodeDesc", "%_%", HSCodeDesc))
        }
        if (Importer_Name != '' && Importer_Name != undefined) {
            params.push(utility.generateParams("Importer_Name", "%_%", Importer_Name))
        }
        if (EXPORTER_NAME != '' && EXPORTER_NAME != undefined) {
            params.push(utility.generateParams("EXPORTER_NAME", "%_%", EXPORTER_NAME))
        }

        const querytoexecute = utility.generateFilterQuery(params, 'import_india');
        console.log(querytoexecute);
        await db.query(querytoexecute[0], querytoexecute[1], (error, results) => {
            return res.status(200).json(success("Ok", results.rows, res.statusCode));
        })
    } catch (err) {
        return res.status(500).json(error(err, res.statusCode));
    };
    //db.end;
}

// to get export data
exports.getexporttwithsearch = async (req, res) => {
    //db.connect();
    try {
        const { fromDate, toDate, HSCODE, HSCodeDesc, Importer_Name, EXPORTER_NAME } = req.query;
        let params = []

        if (fromDate != '' && fromDate != undefined) {
            params.push(utility.generateParams("Date", ">=", fromDate))
        }
        if (toDate != '' && toDate != undefined) {
            params.push(utility.generateParams("Date", "<=", toDate))
        }
        if (HSCODE != '' && HSCODE != undefined) {
            params.push(utility.generateParams("HSCODE", "%_%", HSCODE))
        }
        if (HSCodeDesc != '' && HSCodeDesc != undefined) {
            params.push(utility.generateParams("HSCodeDesc", "%_%", HSCodeDesc))
        }
        if (Importer_Name != '' && Importer_Name != undefined) {
            params.push(utility.generateParams("Imp_Name", "%_%", Importer_Name))
        }
        if (EXPORTER_NAME != '' && EXPORTER_NAME != undefined) {
            params.push(utility.generateParams("Exp_Name", "%_%", EXPORTER_NAME))
        }

        const querytoexecute = utility.generateFilterQuery(params, 'export_india');
        console.log(querytoexecute);
        await db.query(querytoexecute[0], querytoexecute[1], (error, results) => {
            return res.status(200).json(success("Ok", results.rows, res.statusCode));
        })
    } catch (err) {
        return res.status(500).json(error(err, res.statusCode));
    };
    //db.end;
}

// to get HSCODE list
exports.getHscode = async (req, res) => {

    //db.connect();
    try {
        const { digit } = req.query;
        if (digit == null) {
            db.query(query.get_hscode_export, (error, results) => {
                return res.status(200).json(success("Ok", results.rows, res.statusCode));
            })
        } else {
            db.query(query.get_hscode_export_digit, [digit], (error, results) => {
                return res.status(200).json(success("Ok", results.rows, res.statusCode));
            })
        }
    } catch (err) {
        return res.status(500).json(error(err, res.statusCode));
    };
    //db.end;
}

exports.getSideFilterAccess = async (req, res) => {
    try {
        const { Country } = req.query;
        db.query(query.get_sidefilter_Access, [Country], (error, results) => {
            return res.status(200).json(success("Ok", results.rows, res.statusCode));
        })

    } catch (err) {
        return res.status(500).json(error(err, res.statusCode));
    };
}

exports.getImportExportList = async (req, res) => {
    try {
        const { Country, type } = req.query;
        if (type.toLowerCase() == 'import') {
            db.query('SELECT DISTINCT "Imp_Name", "Exp_Name" FROM public.import_' + Country.toLowerCase() + ' limit 1000', (error, results) => {
                return res.status(200).json(success("Ok", results.rows, res.statusCode));
            })
        } else {
            db.query('SELECT DISTINCT "Imp_Name", "Exp_Name" FROM public.export_' + Country.toLowerCase() + ' limit 1000', (error, results) => {
                return res.status(200).json(success("Ok", results.rows, res.statusCode));
            })
        }

    } catch (err) {
        return res.status(500).json(error(err, res.statusCode));
    };
}

exports.addupdateAccessSideFilter = async (req, res) => {
    try {
        const { HSCode, ProductDescription, ProductDescNative, Exporter, Importer, CountryDestination, CountryofOrigin,
            PortofOrigin, ShipmentMode, Unit, Quantity, MONTH, YEAR, Country, Import, Export, HsProductDescription,
            CommodityDesc, PortofDestination, LoadingPort, Currency, ValueCurrency, NotifyPartName, UQC } = req.body;

        const access = await db.query(query.get_sidefilter_Access, [Country]);
        if(access != null){
            db.query(query.update_sidefilter_Access, [Country, HSCode, ProductDescription, ProductDescNative, Exporter, Importer, 
                CountryDestination, CountryofOrigin,
                PortofOrigin, ShipmentMode, Unit, Quantity, MONTH, YEAR, Import, Export, HsProductDescription,
                CommodityDesc, PortofDestination, LoadingPort, Currency, ValueCurrency, NotifyPartName, UQC], (err, result) => {
                return res.status(201).json(success("Ok", result.command + " Successful.", res.statusCode));
            });
        } else {
            db.query(query.insert_sidefilter_Access, [HSCode, ProductDescription, ProductDescNative, Exporter, Importer, CountryDestination, 
                CountryofOrigin,
                PortofOrigin, ShipmentMode, Unit, Quantity, MONTH, YEAR, Country, Import, Export, HsProductDescription,
                CommodityDesc, PortofDestination, LoadingPort, Currency, ValueCurrency, NotifyPartName, UQC], (err, result) => {
                return res.status(201).json(success("Ok", result.command + " Successful.", res.statusCode));
            });
        }
        
    } catch (err) {
        return res.status(500).json(error(err, res.statusCode));
    };
}

exports.getWorksapce = async (req, res) => {
    try {
        const { UserId } = req.query;
        db.query(query.get_workspace, [UserId], (error, results) => {
            return res.status(200).json(success("Ok", results.rows, res.statusCode));
        })

    } catch (err) {
        return res.status(500).json(error(err, res.statusCode));
    };
}

exports.addWorkspace = async(req,res) =>{
    try {
        const { UserId, Searchbar,Sidefilter } = req.body;
            db.query(query.add_workspace, [UserId, Searchbar, Sidefilter], (err, result) => {
                return res.status(201).json(success("Ok", result.command + " Successful.", res.statusCode));
            });
    } catch (err) {
        return res.status(500).json(error(err, res.statusCode));
    };
}