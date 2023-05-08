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

    const user = await db.query(query.get_user_email, [Email]);
    if (user.rows.length > 0) {
        return res.status(422).json(error("Email already registered !", res.statusCode));
    } else {
        bycrypt.hash(Password, 12).then(hashPassword => {
            db.query(query.add_user, [FullName, CompanyName, MobileNumber, Email, hashPassword, country, ParentUserId, '', '', '', '', config.DefaultRole], async (err, result) => {
                if (!err) {
                    if (ParentUserId == null || ParentUserId == '' || ParentUserId == undefined) {
                        const planDetails = await db.query(query.get_plan_by_name, [config.DefaultPlan]);
                        if (planDetails.rows.length > 0) {
                            db.query(query.add_Plan_Trasaction, [result.rows[0].UserId, planDetails.rows[0].PlanId, planDetails.rows[0].Downloads, planDetails.rows[0].Searches, date.toISOString()], (err, result) => {
                                return res.status(201).json(success("Ok", result.command + " Successful.", res.statusCode));
                            });
                        }
                    } else {
                        mail.SendEmail(Email, config.userRegisterationmailSubject, config.accountcreationmailBody);
                        return res.status(201).json(success("Ok", result.command + " Successful.", res.statusCode));
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
    const Parentuser = await db.query(query.get_user_email, [Email]);
    const user = await db.query(Parentuser.rows[0].ParentUserId != null ? query.get_user_by_parentuser : query.get_user_by_email, [Email]);
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
exports.changePassword = async (req, res) => {
    // //db.connect();
    const { Email, CurrentPassword, NewPassword } = req.body;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        err = [];
        errors.errors.forEach(element => {
            err.push({ field: element.param, message: element.msg });
        });
        return res.status(422).json(validation(err));
    }

    const user = await db.query(query.get_user_by_email_forchangepassword, [Email]);
    if (user?.rows.length > 0) {
        bycrypt.compare(CurrentPassword, user.rows[0].Password)
            .then(doMatch => {
                if (doMatch) {
                    bycrypt.hash(NewPassword, 12).then(hashPassword => {
                        db.query(query.update_password, [hashPassword, user.rows[0].UserId], (error, results) => {
                            if (!error) {
                                return res.status(200).json(success("Password changed Successfully !", res.statusCode));
                            } else {
                                return res.status(500).json(error("Internal server Error", res.statusCode));
                            }
                        })
                    })

                } else {
                    return res.status(200).json(error("Incorrect Current password !", res.statusCode));
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
            if (!error) {
                return res.status(200).json(success("Ok", results.rows, res.statusCode));
            } else {
                return res.status(200).json(success("Ok", error.message, res.statusCode));
            }
        })
    } catch (err) {
        return res.status(500).json(error(err, res.statusCode));
    };
}
exports.getuserlistbyParentId = async (req, res) => {
    try {
        const { ParentUserId } = req.query;
        db.query(query.get_user_by_ParentId, [ParentUserId], (error, results) => {
            if (!error) {
                return res.status(200).json(success("Ok", results.rows, res.statusCode));
            } else {
                return res.status(200).json(success("Ok", error.message, res.statusCode));
            }
        })
    } catch (err) {
        return res.status(500).json(error(err, res.statusCode));
    };
}
exports.enabledisableuser = async (req, res) => {
    const { enable, UserId } = req.body;
    try {
        db.query(query.enable_disable_user, [enable, UserId], (error, results) => {
            if (!error) {
                return res.status(200).json(success("Ok", results.command + " Successful.", res.statusCode));
            }
        })
    } catch (err) {
        return res.status(500).json(error(err, res.statusCode));
    };
}

exports.addUserByAdmin = async (req, res) => {
    const { FullName, CompanyName, MobileNumber, Email, Password, country, ParentUserId, Designation = null, Location = null, GST = null, IEC = null, RoleId
        , PlanId, Downloads, Searches, StartDate, EndDate, Validity, DataAccess, CountryAccess, CommodityAccess,
        TarrifCodeAccess, Workspace, WSSLimit, Downloadfacility, Favoriteshipment, Whatstrending, Companyprofile, Addonfacility, Analysis, User,
        AddUser, EditUser, DeleteUser, AddPlan, EditPlan, DeletePlan, DownloadsAccess, Search, EnableId, DisableId, BlockUser, UnblockUser, ClientList, PlanList, Share } = req.body;

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
                        Favoriteshipment, Whatstrending, Companyprofile, Addonfacility, Analysis, User], (err, reslt) => {
                            if (!err) {
                                db.query(query.add_user_Access, [AddUser, EditUser, DeleteUser, AddPlan, EditPlan, DeletePlan, DownloadsAccess, Search, EnableId, DisableId, BlockUser, UnblockUser, ClientList, PlanList, result.rows[0].UserId, Share], (error, result) => {
                                    console.log(error)
                                })
                                mail.SendEmail(Email, config.userRegisterationmailSubject, config.accountcreationmailBody);
                                return res.status(201).json(success("Ok", reslt.command + " Successful.", res.statusCode));
                            } else {
                                return res.status(201).json(success("Ok", err.message + " Successful.", res.statusCode));
                            }
                        });
                }
                else { return res.status(500).json(error(err.message, res.statusCode)); }
            })
        });
    }
}

exports.updateUserByAdmin = async (req, res) => {
    const { FullName, CompanyName, MobileNumber, Email, Password, country, UserId, Designation = null, Location = null, GST = null, IEC = null, RoleId
        , PlanId, Downloads, Searches, StartDate, EndDate, Validity, DataAccess, CountryAccess, CommodityAccess,
        TarrifCodeAccess, Workspace, WSSLimit, Downloadfacility, Favoriteshipment, Whatstrending, Companyprofile, Addonfacility, Analysis, User,
        AddUser, EditUser, DeleteUser, AddPlan, EditPlan, DeletePlan, DownloadsAccess, Search, EnableId, DisableId, BlockUser, UnblockUser, ClientList, PlanList, Share } = req.body;

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
        //bycrypt.hash(Password, 12).then(hashPassword => {
        db.query(query.update_user, [FullName, CompanyName, MobileNumber, Email, country, Designation, Location, GST, IEC, RoleId, UserId], async (err, result) => {
            if (!err) {
                db.query(query.update_Plan_Trasaction_by_admin, [PlanId, Downloads, Searches, StartDate, EndDate,
                    Validity, DataAccess, CountryAccess, CommodityAccess, TarrifCodeAccess, Workspace, WSSLimit, Downloadfacility,
                    Favoriteshipment, Whatstrending, Companyprofile, Addonfacility, Analysis, User, UserId], (err, result) => {
                        if (!err) {
                            db.query(query.update_user_Access, [UserId, AddUser, EditUser, DeleteUser, AddPlan, EditPlan, DeletePlan, DownloadsAccess, Search, EnableId, DisableId, BlockUser, UnblockUser, ClientList, PlanList, Share], (error, result) => {

                            })
                            mail.SendEmail(Email, config.userUpdatemailSubject, config.accountcreationmailBody);
                            return res.status(201).json(success("Ok", result.command + " Successful.", res.statusCode));
                        } else {
                            return res.status(201).json(success("Ok", err.message, res.statusCode));
                        }
                    });
            }
            else { return res.status(500).json(error(err.message, res.statusCode)); }
        })
        //});
    } else { return res.status(500).json(error("User not found", res.statusCode)); }
}

exports.getAllUserlist = async (req, res) => {
    try {
        db.query(query.get_userlist, (error, results) => {
            if (!error) {
                return res.status(200).json(success("Ok", results.rows, res.statusCode));
            } else {
                return res.status(200).json(success("Ok", error.message, res.statusCode));
            }
        })
    } catch (err) {
        return res.status(500).json(error(err, res.statusCode));
    };
}

// exports.getUserById = async (req, res) => {
//     try {
//         const {UserId} = req.query;
//         db.query(query.get_user_By_Userid,[UserId], (error, results) => {
//             return res.status(200).json(success("Ok", results.rows, res.statusCode));
//         })
//     } catch (err) {
//         return res.status(500).json(error(err, res.statusCode));
//     };
// }