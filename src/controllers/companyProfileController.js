const db = require('../../src/utils/database');
const { success, error } = require('../../src/utils/response');
const utility = require('../utils/utility');
const config = require('../utils/config');
// const query = require('../sql/queries')

exports.getcompanyprofile = async (req, res) => {
    //db.connect();
    try {
        const { countryname, companyname, direction, resultfor } = req.body;
        let query = '';
        let selectedfields = '';
        const dateto = utility.formatDate(new Date());
        if (resultfor.toLowerCase() == 'buyer') {
            const fieldList = ["Exp_Name", "Imp_Name", "HsCode", "Quantity", "ValueInUSD", "Exp_Address", "Exp_Address", "CountryofDestination",
                "Exp_City", "Exp_PIN", "Exp_Phone", "Exp_Email"];
            const availablefield = await db.query('SELECT column_name FROM information_schema.columns WHERE table_name = $1 and column_name = ANY($2)', [direction.toLowerCase() + '_' + countryname.toLowerCase(), fieldList]);
            availablefield.rows.forEach(x => {
                selectedfields += '"' + x.column_name + '",';
            })
            query = 'SELECT ' + selectedfields.replace(/,\s*$/, "") + ' FROM ' + direction.toLowerCase() + '_' + countryname.toLowerCase() + ' where "Imp_Name" = $1 AND "Date" >= $2 AND "Date" <= $3';
        } else {
            const fieldList = ["Exp_Name", "Imp_Name", "HsCode", "Quantity", "ValueInUSD", "CountryofOrigin", "Importer_Address", "Importer_City", "Importer_PIN", "Importer_Phone", "Importer_Email"];
            const availablefield = await db.query('SELECT column_name FROM information_schema.columns WHERE table_name = $1 and column_name = ANY($2)', [direction.toLowerCase() + '_' + countryname.toLowerCase(), fieldList]);
            availablefield.rows.forEach(x => {
                selectedfields += '"' + x.column_name + '",';
            })
            query = 'SELECT ' + selectedfields.replace(/,\s*$/, "") + ' FROM ' + direction.toLowerCase() + '_' + countryname.toLowerCase() + ' where "Exp_Name" = $1 AND "Date" >= $2 AND "Date" <= $3';
        }
        db.query(query, [companyname, config.companyProfileStartDate, dateto], (err, results) => {
            if (!err) {
                return res.status(200).json(success("Ok", results.rows, res.statusCode));
            } else {
                return res.status(200).json(error(err.message, "No Record found !", res.statusCode));
            }
        })
    } catch (err) {
        return res.status(500).json(error(err, res.statusCode));
    };
    //db.end;
}

exports.getcompanydetails = async (req, res) => {
    const { companyname, country, direction } = req.query;
    let query = '';
    if (direction.toLowerCase() == 'import') {
        query = `SELECT "Importer_Phone","Importer_Email","Importer_Address" FROM  ${direction.toLowerCase()}_${country.toLowerCase()}  WHERE "Imp_Name"='${companyname}' limit 1`
    } else {
        query = `SELECT "Exp_Email","Exp_Phone","Exp_Address" FROM  ${direction.toLowerCase()}_${country.toLowerCase()}  WHERE "Exp_Name"='${companyname}' limit 1`
    }

    db.query(query, (err, result) => {
        if (!err) {
            return res.status(200).json(success("Ok", result.rows, res.statusCode));
        } else {
            return res.status(200).json(success("Ok", err.message, res.statusCode));
        }
    });
}

exports.getcompanyprofiledata = async (req, res) => {
    const { companyname, fromdate, todate } = req.query;
    let responsetosend = { buyer: null, supplier: null, hscodes: null, country: null, quantity: null, exportshipment: null , importshipment: null};
    const query = `SELECT distinct "Imp_Name" as buyer FROM public.export_india where "Exp_Name"='${companyname}' and "Date" BETWEEN '${fromdate}' AND '${todate}';SELECT distinct "Exp_Name" as supplier  FROM public.import_india where "Imp_Name"='${companyname}' and "Date" BETWEEN '${fromdate}' AND '${todate}';SELECT distinct "HsCode" as hscodes FROM public.export_india where "Exp_Name"='${companyname}' and "Date" BETWEEN '${fromdate}' AND '${todate}' union SELECT distinct "HsCode"  FROM public.import_india where "Imp_Name"='${companyname}' and "Date" BETWEEN '${fromdate}' AND '${todate}';SELECT distinct "CountryofDestination" as countries FROM public.export_india where "Exp_Name"='${companyname}' and "Date" BETWEEN '${fromdate}' AND '${todate}' union SELECT distinct "CountryofOrigin" as countries FROM public.import_india where "Imp_Name"='${companyname}' and "Date" BETWEEN '${fromdate}' AND '${todate}';SELECT SUM("Quantity") FROM public.export_india where "Exp_Name"='${companyname}' and "Date" BETWEEN '${fromdate}' AND '${todate}' union all SELECT SUM("Quantity")  FROM public.import_india where "Imp_Name"='${companyname}' and "Date" BETWEEN '${fromdate}' AND '${todate}'; SELECT * FROM public.export_india where "Exp_Name"='${companyname}' and "Date" BETWEEN '${fromdate}' AND '${todate}'; SELECT * FROM public.import_india where "Imp_Name"='${companyname}' and "Date" BETWEEN '${fromdate}' AND '${todate}';`

    db.query(query, (err, result) => {
        if (!err) {

            responsetosend.buyer = result[0].rows;
            responsetosend.supplier = result[1].rows;
            responsetosend.hscodes = result[2].rows;
            responsetosend.country = result[3].rows
            responsetosend.quantity = parseInt(result[4].rows[0].sum) + parseInt(result[4].rows[1].sum);
            responsetosend.exportshipment = result[5].rows;
            responsetosend.importshipment = result[6].rows;

            return res.status(200).json(success("Ok", responsetosend, res.statusCode));
        } else {
            return res.status(200).json(success("Ok", err.message, res.statusCode));
        }
    });
}