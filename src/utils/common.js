const { response } = require('express');
const db = require('../utils/database');
const queries = require('../sql/queries');
const utility = require('../utils/utility');

exports.deductSearches = async (UserId, IsWorkspaceSearch) => {
    const planDetails = await db.query(queries.get_Plan_By_UserId, [UserId]);
    
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
    CountryofDestination, Month, Year, uqc, Quantity, PortofOrigin,
    PortofDestination,
    Mode, LoadingPort,
    NotifyPartyName, Currency, page, itemperpage, selectQuery, tablename, isOrderBy) => {
    let params = []

    if (fromDate != '' && fromDate != undefined) {
        params.push(utility.generateParams("Date", ">=", fromDate))
    }
    if (toDate != '' && toDate != undefined) {
        params.push(utility.generateParams("Date", "<=", toDate))
    }
    if (HsCode != '' && HsCode != undefined) {
        params.push(utility.generateParams("HsCode", "SIMILAR TO", "(" + HsCode.join("|") + ")%")) //'(300|500)%'     '(300|500)%'
    }
    if (ProductDesc != '' && ProductDesc != undefined) {
        params.push(utility.generateParams("ProductDesc", "SIMILAR TO","%(" + ProductDesc + ")%" ))
    }
    if (Imp_Name != '' && Imp_Name != undefined) {
        params.push(utility.generateParams("Imp_Name", "IN", Imp_Name.toString()))
    }
    if (Exp_Name != '' && Exp_Name != undefined) {
        params.push(utility.generateParams("Exp_Name", "IN", Exp_Name.toString()))
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
    if (uqc != '' && uqc != undefined) {
        params.push(utility.generateParams("uqc", "ANY", uqc))
    }
    if (Quantity != '' && Quantity != undefined) {
        params.push(utility.generateParams("Quantity", "<=", Quantity))
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

    const querytoexecute = utility.generateFilterQuery(params, selectQuery, tablename);
    const finalQuery = querytoexecute[0] + (isOrderBy ? ' LIMIT ' + parseInt(itemperpage) + ' OFFSET ' + (parseInt(page) - 1) * parseInt(itemperpage) : '')

    return [finalQuery, querytoexecute[1]];
}

exports.getavailableFieldlist = async (tablename) => {
    const fieldList = ["Imp_Name", "Exp_Name"];
    const availablefield = await db.query('SELECT column_name FROM information_schema.columns WHERE table_name = $1 and column_name = ANY($2)', [tablename, fieldList]);
    if (availablefield.rows.length > 0) {
        var fields = [];
        var querystring;
        availablefield.rows.forEach(x => {
            fields.push('"' + x.column_name.toString() + '"');
        })
        if (fields.length == 1) {
            querystring = 'COUNT(distinct  ' + fields[0] + ') as '+fields[0].replace(/"|'/g, '')+'Count';
        } else {
            querystring = 'COUNT(distinct  ' + fields[0] + ') as '+fields[0].replace(/"|'/g, '')+'Count , COUNT(distinct  ' + fields[1] + ') as '+fields[1].replace(/"|'/g, '')+'Count';
        }
        const query = querystring + ' , COUNT(distinct  "HsCode") as TotalHsCode FROM';
        return [query];
    }
}