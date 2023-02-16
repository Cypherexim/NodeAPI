const { response } = require('express');
const db = require('../../src/utils/database');
const { validationResult } = require('express-validator');
const { success, error, validation } = require('../../src/utils/response');
const query = require('../../src/sql/queries');
const utility = require('../utils/utility');
const common = require('../utils/common');


exports.getAnalysisData = async (req, res) => {
    try {
        const { fromDate, toDate, HsCode, ProductDesc, Imp_Name, Exp_Name, CountryofOrigin,
            CountryofDestination, Month, Year, Currency, uqc, Quantity, PortofOrigin,
            PortofDestination,
            Mode, LoadingPort,
            NotifyPartyName, countryname, direction } = req.body;

        const fieldList = ["Quantity", "ValueInUSD", "UnitPriceUSD"];
        const availablefield = await db.query('SELECT column_name FROM information_schema.columns WHERE table_name = $1 and column_name = ANY($2)', [direction.toLowerCase() + '_' + countryname.toLowerCase(), fieldList]);
        if (availablefield.rows.length > 0) {
            var fields = [];
            availablefield.rows.forEach(x => {
                fields.push('ROUND(SUM("' + x.column_name.toString() + '")::numeric,2) as ' + x.column_name.toString());
            })
            const query = '"HsCode", ' + fields.join(",") + ' FROM '; // +  + ' GROUP BY "HsCode"';
            const finalquery = await common.getExportData(fromDate, toDate, HsCode, ProductDesc, Imp_Name, Exp_Name, CountryofOrigin,
                CountryofDestination, Month, Year, uqc, Quantity, PortofOrigin,
                PortofDestination,
                Mode, LoadingPort,
                NotifyPartyName, Currency, 0, 0, query, direction.toLowerCase() + '_' + countryname.toLowerCase(), false);
            db.query(finalquery[0]+' GROUP BY "HsCode"',finalquery[1].slice(1), (err, result) => {
                return res.status(200).json(success("Ok", result.rows, res.statusCode));
            });
        }
    } catch (err) {
        return res.status(500).json(error(err, res.statusCode));
    };
}