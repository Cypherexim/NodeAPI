const { response } = require('express');
const db = require('../../src/utils/database');
const { validationResult } = require('express-validator');
const { success, error, validation } = require('../../src/utils/response');
const query = require('../../src/sql/queries');
const bycrypt = require('bcryptjs');


exports.createPlan = async (req, res) => {

    const { PlanName, Amount, Validity, DataAccess, Downloads, Searches, CountryAccess, CommodityAccess, TarrifCodeAccess,
        Workspace, WSSLimit, Downloadfacility, Favoriteshipment, Whatstrending, Companyprofile, Contactdetails,
        Addonfacility, Analysis, User } = req.body;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        err = [];
        errors.errors.forEach(element => {
            err.push({ field: element.param, message: element.msg });
        });
        return res.status(422).json(validation(err));
    }

    const plan = await db.query(query.get_plan_by_name, [PlanName]);
    if (plan.rows.length > 0) {
        return res.status(422).json(error("Plan name already in the system !", res.statusCode));
    } else {
        db.query(query.add_plan, [PlanName, Amount, Validity, DataAccess, Downloads, Searches, CountryAccess, CommodityAccess, TarrifCodeAccess,
            Workspace, WSSLimit, Downloadfacility, Favoriteshipment, Whatstrending, Companyprofile, Contactdetails,
            Addonfacility, Analysis, User],
            (err, result) => {
                if (!err) {
                    return res.status(201).json(success("Ok", result.command + " Successful.", res.statusCode));
                }
                else { return res.status(500).json(error("Somthing went wrong", res.statusCode)); }
            })
    }
}