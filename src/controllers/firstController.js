
const { response } = require('express');
const db = require('../../src/utils/database');
const { validationResult } = require('express-validator');
const { success, error, validation } = require('../../src/utils/response');


exports.getUsers = async (req, res) => {
    db.connect();
    try {
        db.query('SELECT * FROM public."Users"', (error, results) => {
            return res.status(200).json(success("Ok", results.rows, res.statusCode));
        })
    } catch (err) {
        return res.status(500).json(error(err, res.statusCode));
    };
    db.end;
}

exports.createtUser = async (req, res) => {
    db.connect();
    const user = req.body;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        err = [];
        errors.errors.forEach(element => {
            err.push({ field: element.param, message: element.msg });
        });
        return res.status(422).json(validation(err));
    }
    let insertQuery = `insert into public."Users"("FirstName", "LastName", email) 
                       values('${user.firstname}', '${user.lastname}', '${user.email}')`

    db.query(insertQuery, (err, result) => {
        if (!err) {
            return res.status(200).json(success("Ok", result, res.statusCode));
        }
        else { return res.status(500).json(error("Somthing went wrong", res.statusCode)); }
    })
    db.end();
}