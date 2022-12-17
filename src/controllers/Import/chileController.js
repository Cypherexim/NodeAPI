const { response } = require('express');
const db = require('../../utils/database');
const { validationResult } = require('express-validator');
const { success, error, validation } = require('../../utils/response');
const query = require('../../sql/Import/importQuery');
const utility = require('../../utils/utility');
const common = require('../../utils/common');


// to get import with search data
exports.getchileImport = async (req, res) => {
    //db.connect();
    try {
        const { fromDate, toDate, HSCODE, HSCodeDesc, Importer_Name, EXPORTER_NAME,UserId ,IsWorkspaceSearch} = req.query;

        const check = await common.deductSearches(UserId,IsWorkspaceSearch);
        if (check) {
            await db.query(query.get_chile_import, [fromDate, toDate, HSCODE, HSCodeDesc, Importer_Name, EXPORTER_NAME], (error, results) => {
                return res.status(200).json(success("Ok", results.rows, res.statusCode));
            })
        } else {
            return res.status(200).json(error("You don't have enough search credit please contact admin to recharge !"));
        }
    } catch (err) {
        return res.status(500).json(error(err, res.statusCode));
    };
    //db.end;
}
