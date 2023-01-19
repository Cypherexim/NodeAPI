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

exports.getExportData = async (fromDate, toDate, HsCode, ProductDesc, Imp_Name, Exp_Name, CountryofOrigin,
    CountryofDestination, Month, Year, UQC, Quantity, PortofOrigin,
    PortofDestination,
    Mode, LoadingPort,
    NotifyPartyName, Currency, page, itemperpage, tablename) => {
    let params = []

    if (fromDate != '' && fromDate != undefined) {
        params.push(utility.generateParams("Date", ">=", fromDate))
    }
    if (toDate != '' && toDate != undefined) {
        params.push(utility.generateParams("Date", "<=", toDate))
    }
    if (HSCODE != '' && HSCODE != undefined) {
        params.push(utility.generateParams("HsCode", "ANY", HsCode))
    }
    if (HSCodeDesc != '' && HSCodeDesc != undefined) {
        params.push(utility.generateParams("ProductDesc", "ANY", ProductDesc))
    }
    if (Importer_Name != '' && Importer_Name != undefined) {
        params.push(utility.generateParams("Imp_Name", "ANY", Imp_Name))
    }
    if (EXPORTER_NAME != '' && EXPORTER_NAME != undefined) {
        params.push(utility.generateParams("Exp_Name", "ANY", Exp_Name))
    }
    if (CountryofOrigin != '' && CountryofOrigin != undefined) {
        params.push(utility.generateParams("CountryofOrigin", "ANY", CountryofOrigin))
    }
    if (CountryofDestination != '' && CountryofDestination != undefined) {
        params.push(utility.generateParams("CountryofDestination", "ANY", CountryofDestination))
    }
    if (Month != '' && Month != undefined) {
        params.push(utility.generateParams("Month", "ANY", Month))
    }
    if (Year != '' && Year != undefined) {
        params.push(utility.generateParams("Year", "ANY", Year))
    }
    if (UQC != '' && UQC != undefined) {
        params.push(utility.generateParams("uqc", "ANY", UQC))
    }
    if (Quantity != '' && Quantity != undefined) {
        params.push(utility.generateParams("Quantity", "IN", Quantity))
    }
    if (Currency != '' && Currency != undefined) {
        params.push(utility.generateParams("Currency", "ANY", Currency))
    }
    if (PortofOrigin != '' && PortofOrigin != undefined) {
        params.push(utility.generateParams("PortofOrigin", "ANY", PortofOrigin))
    }
    if (PortofDestination != '' && PortofDestination != undefined) {
        params.push(utility.generateParams("PortofDestination", "ANY", PortofDestination))
    }
    if (Mode != '' && Mode != undefined) {
        params.push(utility.generateParams("Mode", "ANY", Mode))
    }
    if (LoadingPort != '' && LoadingPort != undefined) {
        params.push(utility.generateParams("LoadingPort", "ANY", LoadingPort))
    }
    if (NotifyPartyName != '' && NotifyPartyName != undefined) {
        params.push(utility.generateParams("NotifyPartyName", "ANY", NotifyPartyName))
    }

    const querytoexecute = utility.generateFilterQuery(params, tablename);
    const finalQuery = querytoexecute[0] + ' ORDER BY "RecordID" LIMIT ' + parseInt(itemperpage) + ' OFFSET ' + (parseInt(page) - 1) * parseInt(itemperpage)

    return [finalQuery, querytoexecute[1]];
}