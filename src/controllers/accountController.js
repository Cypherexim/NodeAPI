const { response } = require('express');
const db = require('../../src/utils/database');
const { validationResult } = require('express-validator');
const { success, error, validation } = require('../../src/utils/response');
const query = require('../../src/sql/queries');
const bycrypt = require('bcryptjs');
const config = require('../utils/config');
const mail = require('../utils/mailing');


exports.createUser = async (req, res) => {
    ////db.connect();
    const { FullName, CompanyName, MobileNumber, Email, Password, country, ParentUserId } = req.body;
    const errors = validationResult(req);
    const date = new Date();
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
            db.query(query.add_user, [FullName, CompanyName, MobileNumber, Email, hashPassword, country, ParentUserId, '', '', '', '', config.DefaultRole], async (err, result) => {
                if (!err) {
                    const planDetails = await db.query(query.get_plan_by_name, [config.DefaultPlan]);
                    if (planDetails != null) {
                        db.query(query.add_Plan_Trasaction, [result.rows[0].UserId, planDetails.rows[0].PlanId, planDetails.rows[0].Downloads, planDetails.rows[0].Searches, date.toISOString()], (err, result) => {
                            return res.status(201).json(success("Ok", result.command + " Successful.", res.statusCode));
                        });
                    }
                }
                else { return res.status(500).json(error("Somthing went wrong", res.statusCode)); }
            })
        });
    }
    // //db.end;
}

exports.postLogin = async (req, res) => {
    // //db.connect();
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
    ////db.end;
}

exports.getAccountDetails = async (req, res) => {
    try {
        const { UserId } = req.query;
        db.query(query.get_Searches_By_UserId, [UserId], (error, results) => {
            return res.status(200).json(success("Ok", results.rows, res.statusCode));
        })
    } catch (err) {
        return res.status(500).json(error(err, res.statusCode));
    };
}

exports.addUserByAdmin = async (req, res) => {
    const { FullName, CompanyName, MobileNumber, Email, Password, country, ParentUserId, Designation = null, Location = null, GST = null, IEC = null, RoleId
        , PlanId, Downloads, Searches, StartDate, EndDate, Validity, DataAccess, CountryAccess, CommodityAccess,
        TarrifCodeAccess, Workspace, WSSLimit, Downloadfacility, Favoriteshipment, Whatstrending, Companyprofile, Addonfacility, Analysis, User } = req.body;

    const errors = validationResult(req);
    const date = new Date();
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
            db.query(query.add_user, [FullName, CompanyName, MobileNumber, Email, hashPassword, country, ParentUserId, Designation, Location, GST, IEC, RoleId], async (err, result) => {
                if (!err) {
                    db.query(query.add_Plan_Trasaction_by_admin, [result.rows[0].UserId, PlanId, Downloads, Searches, StartDate, EndDate,
                        Validity, DataAccess, CountryAccess, CommodityAccess, TarrifCodeAccess, Workspace, WSSLimit, Downloadfacility,
                        Favoriteshipment, Whatstrending, Companyprofile, Addonfacility, Analysis, User], (err, result) => {
                            mail.SendEmail(Email, config.userRegisterationmailSubject, config.accountcreationmailBody);
                            return res.status(201).json(success("Ok", result.command + " Successful.", res.statusCode));
                        });
                }
                else { return res.status(500).json(error(err.message, res.statusCode)); }
            })
        });
    }
}

exports.getAllUserlist = async (req, res) => {
    try {
        db.query(query.get_userlist, (error, results) => {
            return res.status(200).json(success("Ok", results.rows, res.statusCode));
        })
    } catch (err) {
        return res.status(500).json(error(err, res.statusCode));
    };
}