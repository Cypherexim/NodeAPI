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
            NotifyPartyName, countryname, direction, fieldName = 'HsCode' } = req.body;
        const Requestedfield = [fieldName];
        const requestedfieldavailable = await db.query('SELECT column_name FROM information_schema.columns WHERE table_name = $1 and column_name = ANY($2)', [direction.toLowerCase() + '_' + countryname.toLowerCase(), Requestedfield]);
        if(requestedfieldavailable.rows.length >0){
        const fieldList = ["Quantity", "ValueInUSD", "UnitPriceUSD"];
        const availablefield = await db.query('SELECT column_name FROM information_schema.columns WHERE table_name = $1 and column_name = ANY($2)', [direction.toLowerCase() + '_' + countryname.toLowerCase(), fieldList]);
        if (availablefield.rows.length > 0) {
            var fields = [];
            availablefield.rows.forEach(x => {
                if (x.column_name.toString() != "UnitPriceUSD") {
                    fields.push('ROUND(SUM("' + x.column_name.toString() + '")::numeric,2) as ' + x.column_name.toString());
                } else {
                    fields.push('ROUND(AVG("' + x.column_name.toString() + '")::numeric,2) as ' + x.column_name.toString());
                }
            })
            const query = '"' + fieldName + '", ' + fields.join(",") + ' FROM '; // +  + ' GROUP BY "HsCode"';
            const finalquery = await common.getExportData(fromDate, toDate, HsCode, ProductDesc, Imp_Name, Exp_Name, CountryofOrigin,
                CountryofDestination, Month, Year, uqc, Quantity, PortofOrigin,
                PortofDestination,
                Mode, LoadingPort,
                NotifyPartyName, Currency, 0, 0, query, direction.toLowerCase() + '_' + countryname.toLowerCase(), false);
            db.query(finalquery[0] + ' GROUP BY "' + fieldName + '"', finalquery[1].slice(1), (err, result) => {
                return res.status(200).json(success("Ok", result.rows, res.statusCode));
            });
        } else {
            return res.status(200).json(success("Ok", "Seems either of column Quantity/ValueInUSD/UnitPriceUSD not available in table.", res.statusCode));
        }
    }else {
        return res.status(200).json(success("Ok", "Seems column "+fieldName+" not available in table so can't produce analysis.", res.statusCode));
    }
    } catch (err) {
        return res.status(500).json(error(err, res.statusCode));
    };
}