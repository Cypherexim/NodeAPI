const { response } = require('express');
const db = require('../../src/utils/database');
const { validationResult } = require('express-validator');
const { success, error, validation } = require('../../src/utils/response');
const query = require('../../src/sql/queries');


exports.getCountries = async (req, res) => {
    //db.connect();
    try {
        db.query(query.getCountry, (err, results) => {
            if (!err) {
                return res.status(200).json(success("Ok", results.rows, res.statusCode));
            } else {
                return res.status(200).json(success("Ok", error.message, res.statusCode));
            }
        })
    } catch (err) {
        return res.status(500).json(error(err, res.statusCode));
    };
    //db.end;
}

exports.getCountrieswithoutdate = async (req, res) => {
    //db.connect();
    try {
        db.query(query.getCountryWithoutDate, (err, results) => {
            if (!err) {
                return res.status(200).json(success("Ok", results.rows, res.statusCode));
            } else {
                return res.status(200).json(error("Ok", error.message, res.statusCode));
            }
        })
    } catch (err) {
        return res.status(500).json(error(err, res.statusCode));
    };
    //db.end;
}

exports.addCountry = async (req, res) => {
    const { countryCode, countryName, imp, exp } = req.body;
    try {
        const country = await db.query(query.getCountryByCountrycode, [countryCode]);
        if (country.rows.length > 0) {
            return res.status(200).json(error("Country Already exists!",[] , res.statusCode));
        } else {
            db.query(query.addCountry, [countryCode, countryName, imp, exp], (error, results) => {
                if (!error) {
                    db.query(query.addDownloadCost, [countryCode, 1], (err, results) => {
                        if (!err) {
                            return res.status(200).json(success("Ok", results.rows, res.statusCode));
                        }
                    })
                }
            })
        }
    } catch (err) {
        return res.status(500).json(error(err, res.statusCode));
    };
}

exports.updateCountry = async (req, res) => {
    const { countryCode, imp, exp } = req.body;
    try {
        db.query(query.update_country, [imp, exp, countryCode], (error, results) => {
            if (!error) {
                return res.status(200).json(success("Ok", results.rows, res.statusCode));
            }
        })
    } catch (err) {
        return res.status(500).json(error(err, res.statusCode));
    };
}

exports.addDataHistory = async (req, res) => {
    const { countryName, direction, latestDate } = req.body;
    try {
        const values = await db.query(query.getLatestDate, [countryName, direction]);
        if (values.rows.length > 0) {
            db.query(query.updateDataHistory, [latestDate, countryName, direction], (error, results) => {
                if (!error) {
                    return res.status(200).json(success("Ok", results.command + " Successful.", res.statusCode));
                } else {
                    return res.status(500).json(success("Ok", "Internal server error !", res.statusCode));
                }
            })
        } else {
            db.query(query.addDataHistory, [countryName, direction, latestDate], (error, results) => {
                if (!error) {
                    return res.status(200).json(success("Ok", results.command + " Successful.", res.statusCode));
                } else {
                    return res.status(500).json(success("Ok", "Internal server error !", res.statusCode));
                }
            })
        }
    } catch (err) {
        return res.status(500).json(error(err, res.statusCode));
    };
}

exports.getlatestDate = async (req, res) => {
    //db.connect();
    try {
        const { countryName, direction } = req.query;
        db.query(query.getLatestDate, [countryName, direction], (error, results) => {
            if (!error) {
                return res.status(200).json(success("Ok", results.rows, res.statusCode));
            } else {
                return res.status(200).json(success("Ok", error.message, res.statusCode));
            }
        })
    } catch (err) {
        return res.status(500).json(error(err, res.statusCode));
    };
    //db.end;
}