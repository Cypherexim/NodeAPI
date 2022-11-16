const { response } = require('express');
const db = require('../../utils/database');
const { validationResult } = require('express-validator/check');
const { success, error, validation } = require('../../utils/response');
const query = require('../../sql/Import/importQuery');
const utility = require('../../utils/utility');
db.connect();


// to get import with search data
exports.getindiaImport = async (req, res) => {
    try {
        const { fromDate, toDate, HSCODE, HSCodeDesc, Importer_Name, EXPORTER_NAME } = req.query;
       
        await db.query(query.get_india_import,[fromDate,toDate,HSCODE,HSCodeDesc,Importer_Name,EXPORTER_NAME], (error, results) => {
            return res.status(200).json(success("Ok", results.rows, res.statusCode));
        })
    } catch (err) {
        return res.status(500).json(error(err, res.statusCode));
    };
    db.end;
}