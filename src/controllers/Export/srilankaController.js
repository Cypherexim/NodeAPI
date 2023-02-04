const { response } = require('express');
const db = require('../../utils/database');
const { validationResult } = require('express-validator');
const { success, error, validation } = require('../../utils/response');
const query = require('../../sql/Export/exportQuery');
const common = require('../../utils/common');
const config = require('../../utils/config');



// to get import with search data
exports.getsrilankaExport = async (req, res) => {
    try {
        const { fromDate, toDate, HsCode, ProductDesc, Imp_Name, Exp_Name, CountryofOrigin,
            CountryofDestination, Month, Year, Currency, uqc, Quantity, PortofOrigin,
            PortofDestination,
            Mode, LoadingPort,
            NotifyPartyName, UserId, IsWorkspaceSearch = false,
            page, itemperpage } = req.body;
        var result = {counters:{}, data:{}};
        const check = await common.deductSearches(UserId, IsWorkspaceSearch);
        if (check) {
            const query = await common.getExportData(fromDate, toDate, HsCode, ProductDesc, Imp_Name, Exp_Name, CountryofOrigin,
                CountryofDestination, Month, Year, uqc, Quantity, PortofOrigin,
                PortofDestination,
                Mode, LoadingPort,
                NotifyPartyName, Currency, page, itemperpage, config.select_Query_for_totalrecords, config.export_srilanka, true);
            const counterquery = await common.getExportData(fromDate, toDate, HsCode, ProductDesc, Imp_Name, Exp_Name, CountryofOrigin,
                CountryofDestination, Month, Year, uqc, Quantity, PortofOrigin,
                PortofDestination,
                Mode, LoadingPort,
                NotifyPartyName, Currency, page, itemperpage, await common.getavailableFieldlist(config.export_srilanka), config.export_srilanka, false);
                db.query(query[0], query[1].slice(1), (error, results) => {
                    result.data = results.rows;
                    db.query(counterquery[0], counterquery[1].slice(1), (error, results) => {
                        result.counters = results.rows[0];
                        if (!error) {
                            return res.status(200).json(success("Ok", result, res.statusCode));
                        } else {
                            return res.status(500).json(error("Internal server error", res.statusCode));
                        }
                    })
                    
                })
        } else {
            return res.status(200).json(error("You don't have enough search credit please contact admin to recharge !"));
        }

    } catch (err) {
        return res.status(500).json(error(err, res.statusCode));
    };
}
