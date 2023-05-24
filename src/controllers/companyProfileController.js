const { response } = require('express');
const db = require('../../src/utils/database');
const { validationResult } = require('express-validator');
const { success, error, validation } = require('../../src/utils/response');
const query = require('../../src/sql/queries');
const utility = require('../utils/utility');
const common = require('../utils/common');

exports.getcompanyprofile = async (req, res) => {
    //db.connect();
    try {
        const { countryname, companyname, direction, resultfor } = req.body;
        let query = '';
        if (resultfor.toLowerCase() == 'buyer') {
            query = 'SELECT COUNT(*) FROM ' + direction.toLowerCase() + '_' + countryname.toLowerCase() + ' where "Imp_Name" = $1';
        } else {
            query = 'SELECT COUNT(*) FROM ' + direction.toLowerCase() + '_' + countryname.toLowerCase() + ' where "Exp_Name" = $1';
        }
        db.query(query,[companyname], (error, results) => {
            return res.status(200).json(success("Ok", results.rows, res.statusCode));
        })
    } catch (err) {
        return res.status(500).json(error(err, res.statusCode));
    };
    //db.end;
}