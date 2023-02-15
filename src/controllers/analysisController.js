const { response } = require('express');
const db = require('../../src/utils/database');
const { validationResult } = require('express-validator');
const { success, error, validation } = require('../../src/utils/response');
const query = require('../../src/sql/queries');
const utility = require('../utils/utility');
const common = require('../utils/common');


exports.getAnalysisData = async (req, res) => {
    try {
        const { countryname, direction } = req.query;
        const fieldList = ["Quantity", "ValueInUSD", "UnitPriceUSD"];
        const availablefield = await db.query('SELECT column_name FROM information_schema.columns WHERE table_name = $1 and column_name = ANY($2)', [direction.toLowerCase() + '_' + countryname.toLowerCase(), fieldList]);
        if (availablefield.rows.length > 0) {
            var fields = [];
            availablefield.rows.forEach(x => {
                fields.push('ROUND(SUM("' + x.column_name.toString() + '")::numeric,2) as ' + x.column_name.toString());
            })
            const query = 'SELECT "HsCode", ' + fields.join(",") + ' FROM ' + direction.toLowerCase() + '_' + countryname.toLowerCase() + ' GROUP BY "HsCode"';

            db.query(query, (err, result) => {
                return res.status(200).json(success("Ok", result.rows, res.statusCode));
            });
        }
    } catch (err) {
        return res.status(500).json(error(err, res.statusCode));
    };
}