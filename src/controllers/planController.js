const db = require('../../src/utils/database');
const { validationResult } = require('express-validator');
const { success, error, validation } = require('../../src/utils/response');
const query = require('../../src/sql/queries');


exports.createPlan = async (req, res) => {

    const { PlanName, Amount, Validity, DataAccess, Downloads, Searches, CountryAccess, CommodityAccess, TarrifCodeAccess,
        Workspace, WSSLimit, Downloadfacility, Favoriteshipment, Whatstrending, Companyprofile, Contactdetails,
        Addonfacility, Analysis, User, PlanId } = req.body;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        err = [];
        errors.errors.forEach(element => {
            err.push({ field: element.param, message: element.msg });
        });
        return res.status(422).json(validation(err));
    }


    if (PlanId != undefined && PlanId != null) {

        db.query(query.update_plan, [PlanName, Amount, Validity, DataAccess, Downloads, Searches, CountryAccess, CommodityAccess, TarrifCodeAccess,
            Workspace, WSSLimit, Downloadfacility, Favoriteshipment, Whatstrending, Companyprofile, Contactdetails,
            Addonfacility, Analysis, User, PlanId],
            (err, result) => {
                if (!err) {
                    return res.status(201).json(success("Ok", result.command + " Successful.", res.statusCode));
                }
                else { return res.status(500).json(error("Somthing went wrong", res.statusCode)); }
            })

    } else {
        const plan = await db.query(query.get_plan_by_name, [PlanName]);

        if (plan.rows.length > 0) {
            return res.status(422).json(error("Plan name already in the system !", res.statusCode));
        }
        else {
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

}

exports.getPlanList = async (req, res) => {
    try {
        db.query(query.get_plan_list, (err, result) => {
            return res.status(200).json(success("Ok", result.rows, res.statusCode));
        });
    } catch (err) {
        return res.status(500).json(error(err, res.statusCode));
    };
}