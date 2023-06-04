const { response } = require('express');
const db = require('../../src/utils/database');
const { validationResult } = require('express-validator');
const { success, error, validation } = require('../../src/utils/response');
const query = require('../../src/sql/queries');
const utility = require('../utils/utility');
const common = require('../utils/common');
const config = require('../utils/config');

exports.getcompanyprofile = async (req, res) => {
    //db.connect();
    try {
        const { countryname, companyname, direction, resultfor } = req.body;
        let query = '';
        let selectedfields = '';
        const dateto = utility.formatDate(new Date());
        if (resultfor.toLowerCase() == 'buyer') {
            const fieldList = ["Exp_Name", "Imp_Name", "HsCode", "Quantity", "ValueInUSD", "Exp_Address", "Exp_Address", "CountryofDestination",
                "Exp_City", "Exp_PIN", "Exp_Phone", "Exp_Email"];
            const availablefield = await db.query('SELECT column_name FROM information_schema.columns WHERE table_name = $1 and column_name = ANY($2)', [direction.toLowerCase() + '_' + countryname.toLowerCase(), fieldList]);
            availablefield.rows.forEach(x => {
                selectedfields += '"' + x.column_name + '",';
            })
            query = 'SELECT ' + selectedfields.replace(/,\s*$/, "") + ' FROM ' + direction.toLowerCase() + '_' + countryname.toLowerCase() + ' where "Imp_Name" = $1 AND "Date" >= $2 AND "Date" <= $3';
        } else {
            const fieldList = ["Exp_Name", "Imp_Name", "HsCode", "Quantity", "ValueInUSD","CountryofOrigin", "Importer_Address", "Importer_City", "Importer_PIN", "Importer_Phone", "Importer_Email"];
            const availablefield = await db.query('SELECT column_name FROM information_schema.columns WHERE table_name = $1 and column_name = ANY($2)', [direction.toLowerCase() + '_' + countryname.toLowerCase(), fieldList]);
            availablefield.rows.forEach(x => {
                selectedfields += '"' + x.column_name + '",';
            })
            query = 'SELECT ' + selectedfields.replace(/,\s*$/, "") + ' FROM ' + direction.toLowerCase() + '_' + countryname.toLowerCase() + ' where "Exp_Name" = $1 AND AND "Date" >= $2 AND "Date" <= $3';
        }
        db.query(query, [companyname, config.companyProfileStartDate, dateto], (err, results) => {
            if (!err) {
                return res.status(200).json(success("Ok", results.rows, res.statusCode));
            } else {
                return res.status(200).json(error(err.message, "No Record found !", res.statusCode));
            }
        })
    } catch (err) {
        return res.status(500).json(error(err, res.statusCode));
    };
    //db.end;
}