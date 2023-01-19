const { response } = require('express');
const db = require('../../utils/database');
const { validationResult } = require('express-validator');
const { success, error, validation } = require('../../utils/response');
const query = require('../../sql/Export/exportQuery');
const common = require('../../utils/common');

// to get import with search data
exports.getphilipExport = async (req, res) => {
    try {
        const { fromDate, toDate, HsCode, ProductDesc, Imp_Name, Exp_Name, CountryofOrigin,
            CountryofDestination, Month, Year, Currency, UQC, Quantity, PortofOrigin,
            PortofDestination,
            Mode, LoadingPort,
            NotifyPartyName, UserId, IsWorkspaceSearch = false,
            page, itemperpage } = req.body;

        const check = await common.deductSearches(UserId, IsWorkspaceSearch);
        if (check) {
            const query = await common.getExportData(fromDate, toDate, HsCode, ProductDesc, Imp_Name, Exp_Name, CountryofOrigin,
                CountryofDestination, Month, Year, UQC, Quantity, PortofOrigin,
                PortofDestination,
                Mode, LoadingPort,
                NotifyPartyName, Currency, page, itemperpage, 'export_philip');

            db.query(query[0], query[1].slice(1), (error, results) => {
                if (!error) {
                    return res.status(200).json(success("Ok", results.rows, res.statusCode));
                } else {
                    return res.status(500).json(error("Internal server error", res.statusCode));
                }
            })
        } else {
            return res.status(200).json(error("You don't have enough search credit please contact admin to recharge !"));
        }

    } catch (err) {
        return res.status(500).json(error(err, res.statusCode));
    };
}