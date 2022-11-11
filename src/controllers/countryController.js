const { response } = require('express');
const db = require('../../src/utils/database');
const { validationResult } = require('express-validator/check');
const { success, error, validation } = require('../../src/utils/response');
const query = require('../../src/sql/queries');
db.connect();

exports.getCountries = async (req, res) => {
    try {
        db.query(query.getCountry, (error, results) => {
            return res.status(200).json(success("Ok", results.rows, res.statusCode));
        })
    } catch (err) {
        return res.status(500).json(error(err, res.statusCode));
    };
    db.end;
}