const { response } = require('express');
const db = require('../../src/utils/database');
const { validationResult } = require('express-validator/check');
const { success, error, validation } = require('../../src/utils/response');
const query = require('../../src/sql/queries');
db.connect();

exports.createtUser = async (req, res) => {
    const {FullName, CompanyName, MobileNumber, Email, Password} = req.body;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        err = [];
        errors.errors.forEach(element => {
            err.push({ field: element.param, message: element.msg });
        });
        return res.status(422).json(validation(err));
    }

    db.query(query.add_user,[FullName, CompanyName, MobileNumber,Email, Password], (err, result) => {
        if (!err) {
            return res.status(201).json(success("Ok", result.command+" Successful.", res.statusCode));
        }
        else { return res.status(500).json(error("Somthing went wrong", res.statusCode)); }
    })
    db.end;
}