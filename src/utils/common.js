const { response } = require('express');
const db = require('../utils/database');
const queries = require('../sql/queries');
const utility = require('../utils/utility');

exports.deductSearches = async (UserId, IsWorkspaceSearch) => {
    const planDetails = await db.query(queries.get_Plan_By_UserId, [UserId]);
    console.log(JSON.parse(IsWorkspaceSearch));
    if (!JSON.parse(IsWorkspaceSearch)) {
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
    } else { return true }
}

exports.getExportData = async (fromDate, toDate, HSCODE, HSCodeDesc, Importer_Name, EXPORTER_NAME, CountryofOrigin,
    CountryofDestination, Month, Year, UQC, Quantity, Currency, page, itemperpage, tablename) => {
    let params = []

    if (fromDate != '' && fromDate != undefined) {
        params.push(utility.generateParams("Date", ">=", fromDate))
    }
    if (toDate != '' && toDate != undefined) {
        params.push(utility.generateParams("Date", "<=", toDate))
    }
    if (HSCODE != '' && HSCODE != undefined) {
        params.push(utility.generateParams("HsCode", "IN", HSCODE))
    }
    if (HSCodeDesc != '' && HSCodeDesc != undefined) {
        params.push(utility.generateParams("ProductDesc", "IN", HSCodeDesc))
    }
    if (Importer_Name != '' && Importer_Name != undefined) {
        params.push(utility.generateParams("Imp_Name", "IN", Importer_Name))
    }
    if (EXPORTER_NAME != '' && EXPORTER_NAME != undefined) {
        params.push(utility.generateParams("Exp_Name", "IN", EXPORTER_NAME))
    }
    if (CountryofOrigin != '' && CountryofOrigin != undefined) {
        params.push(utility.generateParams("CountryofOrigin", "IN", CountryofOrigin))
    }
    if (CountryofDestination != '' && CountryofDestination != undefined) {
        params.push(utility.generateParams("CountryofDestination", "IN", CountryofDestination))
    }
    if (Month != '' && Month != undefined) {
        params.push(utility.generateParams("Month", "IN", Month))
    }
    if (Year != '' && Year != undefined) {
        params.push(utility.generateParams("Year", "IN", Year))
    }
    if (UQC != '' && UQC != undefined) {
        params.push(utility.generateParams("uqc", "IN", UQC))
    }
    if (Quantity != '' && Quantity != undefined) {
        params.push(utility.generateParams("Quantity", "IN", Quantity))
    }
    if (Currency != '' && Currency != undefined) {
        params.push(utility.generateParams("Currency", "IN", Currency))
    }

    const querytoexecute = utility.generateFilterQuery(params, tablename);
    const finalQuery = querytoexecute[0] + ' ORDER BY "RecordID" LIMIT ' + parseInt(itemperpage) + ' OFFSET ' + (parseInt(page) - 1) * parseInt(itemperpage)

    return [finalQuery,querytoexecute[1]];
}