const { response } = require('express');
const db = require('../../utils/database');
const { validationResult } = require('express-validator');
const { success, error, validation } = require('../../utils/response');
const query = require('../../sql/Export/exportQuery');
const utility = require('../../utils/utility');



// to get import with search data
exports.getsrilankaExport = async (req, res) => {
    db.connect();
    try {
        const { fromDate, toDate, HSCODE, HSCodeDesc, Importer_Name, EXPORTER_NAME } = req.query;
        await db.query(query.get_srilanka_export,[fromDate,toDate,HSCODE,HSCodeDesc,Importer_Name,EXPORTER_NAME], (error, results) => {
            return res.status(200).json(success("Ok", results.rows, res.statusCode));
        })
    } catch (err) {
        return res.status(500).json(error(err, res.statusCode));
    };
    db.end;
}
