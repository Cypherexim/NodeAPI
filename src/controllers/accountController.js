const { response } = require('express');
const db = require('../../src/utils/database');
const { validationResult } = require('express-validator');
const { success, error, validation } = require('../../src/utils/response');
const query = require('../../src/sql/queries');
const bycrypt = require('bcryptjs');


exports.createtUser = async (req, res) => {
    db.connect();
    const { FullName, CompanyName, MobileNumber, Email, Password, country,ParentUserId } = req.body;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        err = [];
        errors.errors.forEach(element => {
            err.push({ field: element.param, message: element.msg });
        });
        return res.status(422).json(validation(err));
    }

    const user = await db.query(query.get_user_by_email, [Email]);
    if (user.rows.length > 0) {
        return res.status(422).json(error("Email already registered !", res.statusCode));
    } else {
        bycrypt.hash(Password, 12).then(hashPassword => {
            db.query(query.add_user, [FullName, CompanyName, MobileNumber, Email, hashPassword,country,ParentUserId ], (err, result) => {
                if (!err) {
                    return res.status(201).json(success("Ok", result.command + " Successful.", res.statusCode));
                }
                else { return res.status(500).json(error("Somthing went wrong", res.statusCode)); }
            })
        });
    }
    db.end();
}

exports.postLogin = async (req, res) => {
    db.connect();
    const { Email, Password } = req.body;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        err = [];
        errors.errors.forEach(element => {
            err.push({ field: element.param, message: element.msg });
        });
        return res.status(422).json(validation(err));
    }

    const user = await db.query(query.get_user_by_email, [Email]);
    if (user?.rows.length > 0) {
        bycrypt.compare(Password, user.rows[0].Password)
            .then(doMatch => {
                if (doMatch) {
                    return res.status(200).json(success("Login Successfully !", user.rows[0], res.statusCode));
                } else {
                    return res.status(200).json(error("Wrong password !", res.statusCode));
                }
            })
            .catch(err => {
                return res.status(500).json(error(err, res.statusCode));
            })
    } else {
        return res.status(200).json(error("Email not found !", res.statusCode));
    }
    db.end();
}