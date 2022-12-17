const { response } = require('express');
const db = require('../utils/database');
const queries = require('../sql/queries');

exports.deductSearches = async (UserId, IsWorkspaceSearch) => {
    const planDetails = await db.query(queries.get_Plan_By_UserId, [UserId]);
    console.log(JSON.parse(IsWorkspaceSearch));
    if (! JSON.parse(IsWorkspaceSearch)) {
        if (planDetails.rows[0] != null) {
            if (planDetails.rows[0].Searches > 0 || planDetails.rows[0].Searches == 'Unlimited') {
                const latestSearchCount = planDetails.rows[0].Searches - 1;
                db.query(queries.update_Plan_transaction, [latestSearchCount, UserId], (err, result) => {

                });
                return true;
            } else {
                return false;
            }
        } else {
            return false;
        }
    } else {return true}
}
