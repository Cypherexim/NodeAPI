const { response } = require('express');
const db = require('../../src/utils/database');
const { validationResult } = require('express-validator');
const { success, error, validation } = require('../../src/utils/response');
const query = require('../../src/sql/queries');


exports.getCountries = async (req, res) => {
    //db.connect();
    try {
        db.query(query.getCountry, (error, results) => {
            if(!error){
            return res.status(200).json(success("Ok", results.rows, res.statusCode));
            }else {
                return res.status(200).json(success("Ok", error.message, res.statusCode));
            }
        })
    } catch (err) {
        return res.status(500).json(error(err, res.statusCode));
    };
    //db.end;
}

exports.addCountry = async (req, res) => {
    const { countryCode, countryName, imp, exp } = req.body;
    try {
        db.query(query.addCountry, [countryCode, countryName, imp, exp], (error, results) => {
            if (!error) {
                db.query(query.addDownloadCost, [countryCode, 1], (err, results) => {
                    if (!err) {
                        return res.status(200).json(success("Ok", results.rows, res.statusCode));
                    }
                })
            }
        })
    } catch (err) {
        return res.status(500).json(error(err, res.statusCode));
    };
}