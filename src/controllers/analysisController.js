const db = require('../../src/utils/database');
const { success, error } = require('../../src/utils/response');
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
        if (requestedfieldavailable.rows.length > 0) {
            const fieldList = ["Quantity", "ValueInUSD", "UnitPriceUSD", "UnitPriceFC", "Asset_Value_USD"];
            const availablefield = await db.query('SELECT column_name FROM information_schema.columns WHERE table_name = $1 and column_name = ANY($2)', [direction.toLowerCase() + '_' + countryname.toLowerCase(), fieldList]);
            if (availablefield.rows.length > 0) {
                var fields = [];
                availablefield.rows.forEach(x => {
                    if (x.column_name.toString() != "UnitPriceUSD" && x.column_name.toString() != "UnitPriceFC") {
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
                    if (!err) {
                        fields = null;
                        return res.status(200).json(success("Ok", result.rows, res.statusCode));
                    } else {
                        return res.status(200).json(success("Ok", err.message, res.statusCode));
                    }
                });
            } else {
                return res.status(200).json(success("Ok", "Seems either of column Quantity/ValueInUSD/UnitPriceUSD not available in table.", res.statusCode));
            }
        } else {
            return res.status(200).json(success("Ok", "Seems column " + fieldName + " not available in table so can't produce analysis.", res.statusCode));
        }
    } catch (err) {
        return res.status(500).json(error(err, res.statusCode));
    };
}


exports.getWhatsTrending = async (req, res) => {
    const { country, direction, year } = req.query;

    const fromDate = year + '-01-01';
    const toDate = year + '-02-02';

    db.query('SELECT ROUND(SUM("ValueInUSD")::numeric,2) as LastYearTrend FROM ' + direction.toLowerCase() + '_' + country.toLowerCase() + ' where "Date" >= $1  AND "Date" <= $2', [fromDate, toDate], (err, result) => {
        if (!err) {
            return res.status(200).json(success("Ok", result.rows, res.statusCode));
        } else {
            return res.status(200).json(success("Ok", err.message, res.statusCode));
        }
    });
}

exports.topcountriesByValue = async (req, res) => {
    const { country, direction, fromDate, toDate } = req.query;
    var query = '';
    if (direction.toLowerCase() == 'export') {
        query = `Select ROUND(SUM("ValueInUSD")::numeric,2) as total,"CountryofDestination" from ` + direction.toLowerCase() + '_' + country.toLowerCase() +
            ` WHERE "Date" BETWEEN $1 AND $2 group by "CountryofDestination" ORDER BY total DESC LIMIT 10`;
    } else {
        query = `Select ROUND(SUM("ValueInUSD")::numeric,2) as total,"CountryofOrigin" from ` + direction.toLowerCase() + '_' + country.toLowerCase() +
            ` WHERE "Date" BETWEEN $1 AND $2 group by "CountryofOrigin" ORDER BY total DESC LIMIT 10`;
    }
    db.query(query, [fromDate, toDate], (err, result) => {
        if (!err) {
            return res.status(200).json(success("Ok", result.rows, res.statusCode));
        } else {
            return res.status(200).json(success("Ok", err.message, res.statusCode));
        }
    });
}

exports.getmonthwisepercentagegrowth = async (req, res) => {
    const { country, direction, fromDate, toDate } = req.query;
    var query = `WITH monthly_totals AS (
        SELECT
        (CASE 
         when "Month" = 'JAN' then 1 
         when "Month" = 'FEB' then 2 
         when "Month" = 'MAR' then 3
         when "Month" = 'APR' then 4
         when "Month" = 'MAY' then 5
         when "Month" = 'JUN' then 6
         when "Month" = 'JUL' then 7
         when "Month" = 'AUG' then 8
         when "Month" = 'SEP' then 9
         when "Month" = 'OCT' then 10
         when "Month" = 'NOV' then 11
         when "Month" = 'DEC' then 12
         ELSE 0 END ) as "Months","Year",ROUND(sum("ValueInUSD")::numeric,2) as current_sale, "Month"
                from `+ direction.toLowerCase() + '_' + country.toLowerCase() + ` WHERE "Date" BETWEEN $1 AND $2  
                group by "Year","Months","Month"
                order by "Year","Months"
        )
        SELECT "Months","Month","Year","current_sale", lag("current_sale", 1) over (order by "Year","Months") as previous_month_sale,
                ROUND(100 * ("current_sale" - lag("current_sale", 1) over (order by "Year","Months")) / lag("current_sale", 1) over 
                (order by "Year","Months")::numeric, 2) as growth FROM monthly_totals group by "Year","Months","Month","current_sale"`;
    
    db.query(query, [fromDate, toDate], (err, result) => {
        if (!err) {
            return res.status(200).json(success("Ok", result.rows, res.statusCode));
        } else {
            return res.status(200).json(success("Ok", err.message, res.statusCode));
        }
    });
}