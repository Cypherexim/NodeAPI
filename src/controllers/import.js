const { response } = require('express');
const db = require('../../src/utils/database');
const { validationResult } = require('express-validator');
const { success, error, validation } = require('../../src/utils/response');
const query = require('../../src/sql/queries');
const utility = require('../utils/utility');
const common = require('../utils/common');

// to get import data
exports.getimport = async (req, res) => {
    //db.connect();
    try {
        db.query(query.get_import_by_recordId, [2955314], (error, results) => {
            return res.status(200).json(success("Ok", results.rows, res.statusCode));
        })
    } catch (err) {
        return res.status(500).json(error(err, res.statusCode));
    };
    //db.end;
}

// to get import data
// exports.getimports = async (req, res) => {
//     try {
//         db.query(query.get_import, (error, results) => {
//             return res.status(200).json(success("Ok", results.rows, res.statusCode));
//         })
//     } catch (err) {
//         return res.status(500).json(error(err, res.statusCode));
//     };
//     //db.end;
// }

// to get import data
exports.getimports = async (req, res) => {
    //db.connect();
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            err = [];
            errors.errors.forEach(element => {
                err.push({ field: element.param, message: element.msg });
            });
            return res.status(422).json(validation(err));
        }
        const { fromDate, toDate, HSCODE, HSCodeDesc, Importer_Name, EXPORTER_NAME } = req.body;
        db.query(query.get_import_search, [fromDate, toDate, `%${HSCODE}%`, `%${HSCodeDesc}%`, `%${Importer_Name}%`, `%${EXPORTER_NAME}%`], (error, results) => {
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

// to get import with search data
exports.getimportwithsearch = async (req, res) => {
    //db.connect();
    try {
        const { fromDate, toDate, HSCODE, HSCodeDesc, Importer_Name, EXPORTER_NAME } = req.query;
        let params = []

        if (fromDate != '' && fromDate != undefined) {
            params.push(utility.generateParams("Date", ">=", fromDate))
        }
        if (toDate != '' && toDate != undefined) {
            params.push(utility.generateParams("Date", "<=", toDate))
        }
        if (HSCODE != '' && HSCODE != undefined) {
            params.push(utility.generateParams("HSCODE", "%_%", HSCODE))
        }
        if (HSCodeDesc != '' && HSCodeDesc != undefined) {
            params.push(utility.generateParams("HSCodeDesc", "%_%", HSCodeDesc))
        }
        if (Importer_Name != '' && Importer_Name != undefined) {
            params.push(utility.generateParams("Importer_Name", "%_%", Importer_Name))
        }
        if (EXPORTER_NAME != '' && EXPORTER_NAME != undefined) {
            params.push(utility.generateParams("EXPORTER_NAME", "%_%", EXPORTER_NAME))
        }

        const querytoexecute = utility.generateFilterQuery(params, 'import_india');

        await db.query(querytoexecute[0], querytoexecute[1], (error, results) => {
            return res.status(200).json(success("Ok", results.rows, res.statusCode));
        })
    } catch (err) {
        return res.status(500).json(error(err, res.statusCode));
    };
    //db.end;
}

// to get export data
exports.getexporttwithsearch = async (req, res) => {
    //db.connect();
    try {
        const { fromDate, toDate, HSCODE, HSCodeDesc, Importer_Name, EXPORTER_NAME } = req.query;
        let params = []

        if (fromDate != '' && fromDate != undefined) {
            params.push(utility.generateParams("Date", ">=", fromDate))
        }
        if (toDate != '' && toDate != undefined) {
            params.push(utility.generateParams("Date", "<=", toDate))
        }
        if (HSCODE != '' && HSCODE != undefined) {
            params.push(utility.generateParams("HSCODE", "%_%", HSCODE))
        }
        if (HSCodeDesc != '' && HSCodeDesc != undefined) {
            params.push(utility.generateParams("HSCodeDesc", "%_%", HSCodeDesc))
        }
        if (Importer_Name != '' && Importer_Name != undefined) {
            params.push(utility.generateParams("Imp_Name", "%_%", Importer_Name))
        }
        if (EXPORTER_NAME != '' && EXPORTER_NAME != undefined) {
            params.push(utility.generateParams("Exp_Name", "%_%", EXPORTER_NAME))
        }

        const querytoexecute = utility.generateFilterQuery(params, 'export_india');

        await db.query(querytoexecute[0], querytoexecute[1], (error, results) => {
            return res.status(200).json(success("Ok", results.rows, res.statusCode));
        })
    } catch (err) {
        return res.status(500).json(error(err, res.statusCode));
    };
    //db.end;
}

// to get HSCODE list
exports.getHscode = async (req, res) => {

    //db.connect();
    try {
        const { digit } = req.query;
        if (digit == null) {
            db.query(query.get_hscode_export, (err, results) => {
                if (!err) {
                    return res.status(200).json(success("Ok", results.rows, res.statusCode));
                } else {
                    return res.status(200).json(error(err.message, "No Record found", res.statusCode));
                }
            })
        } else {
            db.query(query.get_hscode_export_digit, [digit], (err, results) => {
                if (!err) {
                    return res.status(200).json(success("Ok", results.rows, res.statusCode));
                } else {
                    return res.status(200).json(error(err.message, "No Record found", res.statusCode));
                }
            })
        }
    } catch (err) {
        return res.status(500).json(error(err, res.statusCode));
    };
    //db.end;
}

exports.getcommonimportlist = async (req, res) => {
    try {
        const { countryname, text } = req.query;
        if (text == null) {
            const qury = 'SELECT * FROM ' + countryname.toLowerCase() + '_companies order by "Imp_Name" limit 500';
            db.query(qury, (err, results) => {
                if (!err) {
                    return res.status(200).json(success("Ok", results.rows, res.statusCode));
                } else {
                    return res.status(200).json(error(err.message, "Records not found !", res.statusCode));
                }
            })
        } else {
            const qury = 'SELECT * FROM ' + countryname.toLowerCase() + '_companies WHERE "Imp_Name" like $1 order by "Imp_Name" limit 500';
            db.query(qury, [text + '%'], (err, results) => {
                if (!err) {
                    return res.status(200).json(success("Ok", results.rows, res.statusCode));
                } else {
                    return res.status(200).json(error(err.message, "Records not found !", res.statusCode));
                }
            })
        }

    } catch (err) {
        return res.status(500).json(error(err, res.statusCode));
    };
}

exports.getcommonexportlist = async (req, res) => {
    try {
        const { countryname, text } = req.query;
        if (text == null) {
            const qury = 'SELECT * FROM ' + countryname.toLowerCase() + '_participate_companies order by "Exp_Name" limit 500';
            db.query(qury, (err, results) => {
                if (!err) {
                    return res.status(200).json(success("Ok", results.rows, res.statusCode));
                } else {
                    return res.status(200).json(error("Ok", "Records not found !", res.statusCode));
                }
            })
        } else {
            const qury = 'SELECT * FROM ' + countryname.toLowerCase() + '_participate_companies WHERE "Exp_Name" like $1 order by "Exp_Name" limit 500';
            db.query(qury, [text + '%'], (err, results) => {
                if (!err) {
                    return res.status(200).json(success("Ok", results.rows, res.statusCode));
                } else {
                    return res.status(200).json(error("Ok", "Records not found !", res.statusCode));
                }
            })
        }

    } catch (err) {
        return res.status(500).json(error(err, res.statusCode));
    };
}

exports.getSideFilterAccess = async (req, res) => {
    try {
        const { Country, Direction } = req.query;
        db.query(query.get_sidefilter_Access, [Country, Direction.toUpperCase()], (err, results) => {
            if (!err) {
                return res.status(200).json(success("Ok", results.rows, res.statusCode));
            } else {
                return res.status(500).json(error(err, res.statusCode));
            }
        })

    } catch (err) {
        return res.status(500).json(error(err, res.statusCode));
    };
}
exports.getAllSideFilterAccess = async (req, res) => {
    try {
        db.query(query.get_all_sidefilter_Access, (err, results) => {
            if (!err) {
                return res.status(200).json(success("Ok", results.rows, res.statusCode));
            } else {
                return res.status(500).json(error(err, res.statusCode));
            }
        })

    } catch (err) {
        return res.status(500).json(error(err, res.statusCode));
    };
}
exports.getImportExportList = async (req, res) => {
    try {
        const { Country, type, fromDate, toDate, text = null } = req.query;
        const fieldList = ["Imp_Name", "Exp_Name"];
        const result = {};
        const availablefield = await db.query('SELECT column_name FROM information_schema.columns WHERE table_name = $1 and column_name = ANY($2)', [type.toLowerCase() + '_' + Country.toLowerCase(), fieldList]);
        if (availablefield.rows.length == 1) {
            if (text != null) {
                const query = 'SELECT DISTINCT "' + availablefield.rows[0].column_name.toString() + '" FROM ' + type.toLowerCase() + '_' + Country.toLowerCase() + ' WHERE "Date" >= $1 AND "Date" <= $2 AND "' + availablefield.rows[0].column_name.toString() + '" LIKE $3';
                db.query(query, [fromDate, toDate, text + '%'], (error, results) => {
                    if (!error) {
                        result[availablefield.rows[0].column_name] = results.rows;
                        return res.status(200).json(success("Ok", result, res.statusCode));
                    } else {
                        return res.status(200).json(success("Ok", error.message, res.statusCode));
                    }
                })

            } else {
                const query = 'SELECT DISTINCT "' + availablefield.rows[0].column_name.toString() + '" FROM ' + type.toLowerCase() + '_' + Country.toLowerCase() + ' WHERE "Date" >= $1 AND "Date" <= $2 limit 500';
                db.query(query, [fromDate, toDate], (error, results) => {
                    if (!error) {
                        result[availablefield.rows[0].column_name] = results.rows;
                        return res.status(200).json(success("Ok", result, res.statusCode));
                    } else {
                        return res.status(200).json(success("Ok", error.message, res.statusCode));
                    }
                })
            }
        } else if (availablefield.rows.length == 2) {
            if (text != null) {
                const query = 'SELECT DISTINCT "' + availablefield.rows[0].column_name.toString() + '" FROM ' + type.toLowerCase() + '_' + Country.toLowerCase() + ' WHERE "Date" >= $1 AND "Date" <= $2 AND "' + availablefield.rows[0].column_name.toString() + '" LIKE $3';
                db.query(query, [fromDate, toDate, text + '%'], (error, results) => {
                    if (!error) {
                        result[availablefield.rows[0].column_name] = results.rows;
                        const query1 = 'SELECT DISTINCT "' + availablefield.rows[1].column_name.toString() + '" FROM ' + type.toLowerCase() + '_' + Country.toLowerCase() + ' WHERE "Date" >= $1 AND "Date" <= $2 AND "' + availablefield.rows[1].column_name.toString() + '" LIKE $3';
                        db.query(query1, [fromDate, toDate, text + '%'], (error, results) => {
                            if (!error) {
                                result[availablefield.rows[1].column_name] = results.rows;
                                return res.status(200).json(success("Ok", result, res.statusCode));
                            } else {
                                return res.status(200).json(success("Ok", error.message, res.statusCode));
                            }
                        })
                    } else {
                        return res.status(200).json(success("Ok", error.message, res.statusCode));
                    }
                })
            } else {
                const query = 'SELECT DISTINCT "' + availablefield.rows[0].column_name.toString() + '" FROM ' + type.toLowerCase() + '_' + Country.toLowerCase() + ' WHERE "Date" >= $1 AND "Date" <= $2 limit 500';
                db.query(query, [fromDate, toDate], (error, results) => {
                    if (!error) {
                        result[availablefield.rows[0].column_name] = results.rows;
                        const query1 = 'SELECT DISTINCT "' + availablefield.rows[1].column_name.toString() + '" FROM ' + type.toLowerCase() + '_' + Country.toLowerCase() + ' WHERE "Date" >= $1 AND "Date" <= $2 limit 500';
                        db.query(query1, [fromDate, toDate], (error, results) => {
                            if (!error) {
                                result[availablefield.rows[1].column_name] = results.rows;
                                return res.status(200).json(success("Ok", result, res.statusCode));
                            } else {
                                return res.status(200).json(success("Ok", error.message, res.statusCode));
                            }
                        })
                    } else {
                        return res.status(200).json(success("Ok", error.message, res.statusCode));
                    }
                })
            }
        }

    } catch (err) {
        return res.status(500).json(error(err, res.statusCode));
    };
}
exports.getImportList = async (req, res) => {
    try {
        const { Country, type, fromDate, toDate, text = null } = req.query;
        const fieldList = ["Imp_Name"];
        const result = {};
        const availablefield = await db.query('SELECT column_name FROM information_schema.columns WHERE table_name = $1 and column_name = ANY($2)', [type.toLowerCase() + '_' + Country.toLowerCase(), fieldList]);
        if (availablefield.rows.length == 1) {
            if (text != null) {
                const query = 'SELECT DISTINCT "' + availablefield.rows[0].column_name.toString() + '" FROM ' + type.toLowerCase() + '_' + Country.toLowerCase() + ' WHERE "' + availablefield.rows[0].column_name.toString() + '" LIKE $3';
                db.query(query, [text + '%'], (error, results) => {
                    if (!error) {
                        result[availablefield.rows[0].column_name] = results.rows;
                        return res.status(200).json(success("Ok", result, res.statusCode));
                    } else {
                        return res.status(200).json(success("Ok", error.message, res.statusCode));
                    }
                })

            } else {
                const query = 'SELECT DISTINCT "' + availablefield.rows[0].column_name.toString() + '" FROM ' + type.toLowerCase() + '_' + Country.toLowerCase() + ' limit 1000';
                db.query(query, (error, results) => {
                    if (!error) {
                        result[availablefield.rows[0].column_name] = results.rows;
                        return res.status(200).json(success("Ok", result, res.statusCode));
                    } else {
                        return res.status(200).json(success("Ok", error.message, res.statusCode));
                    }
                })
            }
        } else {
            return res.status(200).json(success("Ok", "Import Name field not found for this country", res.statusCode));
        }

    } catch (err) {
        return res.status(500).json(error(err, res.statusCode));
    };
}

exports.getExportList = async (req, res) => {
    try {
        const { Country, type, fromDate, toDate, text = null } = req.query;
        const fieldList = ["Exp_Name"];
        const result = {};
        const availablefield = await db.query('SELECT column_name FROM information_schema.columns WHERE table_name = $1 and column_name = ANY($2)', [type.toLowerCase() + '_' + Country.toLowerCase(), fieldList]);
        if (availablefield.rows.length == 1) {
            if (text != null) {
                const query = 'SELECT DISTINCT "' + availablefield.rows[0].column_name.toString() + '" FROM ' + type.toLowerCase() + '_' + Country.toLowerCase() + ' WHERE "' + availablefield.rows[0].column_name.toString() + '" LIKE $3';
                db.query(query, [text + '%'], (error, results) => {
                    if (!error) {
                        result[availablefield.rows[0].column_name] = results.rows;
                        return res.status(200).json(success("Ok", result, res.statusCode));
                    } else {
                        return res.status(200).json(success("Ok", error.message, res.statusCode));
                    }
                })

            } else {
                const query = 'SELECT DISTINCT "' + availablefield.rows[0].column_name.toString() + '" FROM ' + type.toLowerCase() + '_' + Country.toLowerCase() + ' limit 1000';
                db.query(query, (error, results) => {
                    if (!error) {
                        result[availablefield.rows[0].column_name] = results.rows;
                        return res.status(200).json(success("Ok", result, res.statusCode));
                    } else {
                        return res.status(200).json(success("Ok", error.message, res.statusCode));
                    }
                })
            }
        } else {
            return res.status(200).json(success("Ok", "Export Name field not found for this country", res.statusCode));
        }

    } catch (err) {
        return res.status(500).json(error(err, res.statusCode));
    };
}


exports.getimporterexportindia = async (req, res) => {
    try {
        const { text = null } = req.query;
        if (text == null) {
            db.query(query.getimporter_export_india, (err, results) => {
                if (!err) {
                    return res.status(200).json(success("Ok", results.rows, res.statusCode));
                } else {
                    return res.status(500).json(error(err, res.statusCode));
                }
            })
        } else {
            db.query(query.getimporter_export_india_search, [text + '%'], (err, results) => {
                if (!err) {
                    return res.status(200).json(success("Ok", results.rows, res.statusCode));
                } else {
                    return res.status(500).json(error(err, res.statusCode));
                }
            })
        }

    } catch (err) {
        return res.status(500).json(error(err, res.statusCode));
    };
}
exports.getimporterimportindia = async (req, res) => {
    try {
        const { text = null } = req.query;
        if (text == null) {
            db.query(query.getimporter_import_india, (err, results) => {
                if (!err) {
                    return res.status(200).json(success("Ok", results.rows, res.statusCode));
                } else {
                    return res.status(500).json(error(err, res.statusCode));
                }
            })
        } else {
            db.query(query.getimporter_import_india_search, [text + '%'], (err, results) => {
                if (!err) {
                    return res.status(200).json(success("Ok", results.rows, res.statusCode));
                } else {
                    return res.status(500).json(error(err, res.statusCode));
                }
            })
        }

    } catch (err) {
        return res.status(500).json(error(err, res.statusCode));
    };

}
exports.getexporterexportindia = async (req, res) => {
    try {
        const { text = null } = req.query;
        if (text == null) {
            db.query(query.getexporter_export_india, (err, results) => {
                if (!err) {
                    return res.status(200).json(success("Ok", results.rows, res.statusCode));
                } else {
                    return res.status(500).json(error(err, res.statusCode));
                }
            })
        } else {
            db.query(query.getexporter_export_india_search, [text + '%'], (err, results) => {
                if (!err) {
                    return res.status(200).json(success("Ok", results.rows, res.statusCode));
                } else {
                    return res.status(500).json(error(err, res.statusCode));
                }
            })
        }
    } catch (err) {
        return res.status(500).json(error(err, res.statusCode));
    };
}
exports.getexporterimportindia = async (req, res) => {
    try {
        const { text = null } = req.query;
        if (text == null) {
            db.query(query.getexporter_import_india, (err, results) => {
                if (!err) {
                    return res.status(200).json(success("Ok", results.rows, res.statusCode));
                } else {
                    return res.status(500).json(error(err, res.statusCode));
                }
            })
        } else {
            db.query(query.getexporter_import_india_search, [text + '%'], (err, results) => {
                if (!err) {
                    return res.status(200).json(success("Ok", results.rows, res.statusCode));
                } else {
                    return res.status(500).json(error(err, res.statusCode));
                }
            })
        }
    } catch (err) {
        return res.status(500).json(error(err, res.statusCode));
    };
}

exports.addupdateAccessSideFilter = async (req, res) => {
    try {
        const { HsCode, ProductDesc, Exp_Name, Imp_Name, CountryofDestination, CountryofOrigin, PortofOrigin,
            Mode, uqc, Quantity, Month, Year, Country, PortofDestination, LoadingPort, Currency,
            NotifyPartyName, Direction } = req.body;

        const access = await db.query(query.get_sidefilter_Access, [Country, Direction.toUpperCase()]);
        if (access.rows.length > 0) {
            db.query(query.update_sidefilter_Access, [Country, HsCode, ProductDesc, Exp_Name, Imp_Name, CountryofDestination,
                CountryofOrigin, PortofOrigin,
                Mode, uqc, Quantity, Month, Year, PortofDestination, LoadingPort, Currency,
                NotifyPartyName, Direction.toUpperCase()], (err, result) => {
                    return res.status(201).json(success("Ok", result.command + " Successful.", res.statusCode));
                });
        } else {
            db.query(query.insert_sidefilter_Access, [HsCode, ProductDesc, Exp_Name, Imp_Name, CountryofDestination, CountryofOrigin,
                PortofOrigin, Mode, uqc, Quantity, Month, Year, Country, Direction.toUpperCase(), PortofDestination, LoadingPort, Currency,
                NotifyPartyName], (err, result) => {
                    return res.status(201).json(success("Ok", result.command + " Successful.", res.statusCode));
                });
        }

    } catch (err) {
        return res.status(500).json(error(err, res.statusCode));
    };
}

exports.getWorkspace = async (req, res) => {
    try {
        const { UserId } = req.query;
        db.query(query.get_workspace, [UserId], (error, results) => {
            if (!error) {
                return res.status(200).json(success("Ok", results.rows, res.statusCode));
            } else {
                return res.status(200).json(success("Ok", error.message, res.statusCode));
            }
        })

    } catch (err) {
        return res.status(500).json(error(err, res.statusCode));
    };
}

exports.addWorkspace = async (req, res) => {
    try {
        const { UserId, Searchbar, Sidefilter, foldername } = req.body;
        db.query(query.add_workspace, [UserId, Searchbar, Sidefilter, foldername], (err, result) => {
            if (!err) {
                return res.status(201).json(success("Ok", result.command + " Successful.", res.statusCode));
            }
        });
    } catch (err) {
        return res.status(500).json(error(err, res.statusCode));
    };
}
exports.deleteWorkspace = async (req, res) => {
    try {
        const { visibility, Id } = req.body;
        db.query(query.delete_Workspace, [visibility, Id], (err, result) => {
            if (!err) {
                return res.status(201).json(success("Ok", "workspace deleted Successfully.", res.statusCode));
            }
        });
    } catch (err) {
        return res.status(500).json(error(err, res.statusCode));
    };
}
exports.getDownloadCost = async (req, res) => {
    try {
        const { CountryCode } = req.query;
        db.query(query.get_download_cost, [CountryCode], (err, result) => {
            if (!err) {
                return res.status(200).json(success("Ok", result.rows, res.statusCode));
            } else {
                return res.status(200).json(success("Ok", err.message, res.statusCode));
            }
        });
    } catch (err) {
        return res.status(500).json(error(err, res.statusCode));
    };
}

exports.getTotalRecord = async (req, res) => {
    try {
        const { countryname, direction } = req.query;
        db.query('select COUNT(*) from ' + direction + '_' + countryname, (err, result) => {
            return res.status(200).json(success("Ok", result.rows, res.statusCode));
        });
    } catch (err) {
        return res.status(500).json(error(err, res.statusCode));
    };
}

exports.getListofSidefilterdata = async (req, res) => {
    try {
        const { fromDate, toDate, HsCode, ProductDesc, Imp_Name, Exp_Name, CountryofOrigin,
            CountryofDestination, Month, Year, Currency, uqc, Quantity, PortofOrigin,
            PortofDestination,
            Mode, LoadingPort,
            NotifyPartyName, CountryCode, CountryName, Direction } = req.body;
        const access = await db.query(query.get_sidefilter_Access, [CountryCode, Direction.toUpperCase()]);
        var selectQuery = 'Distinct ';
        var output = {};
        if (access.rows.length > 0) {
            const keys = Object.keys(access.rows[0]);
            const obj = access.rows[0];
            for (let i = 0; i < keys.length; i++) {
                if (obj[keys[i]] === true) {
                    selectQuery += '"' + keys[i] + '", '
                }
            }

            const query = await common.getExportData(fromDate, toDate, HsCode, ProductDesc, Imp_Name, Exp_Name, CountryofOrigin,
                CountryofDestination, Month, Year, uqc, Quantity, PortofOrigin,
                PortofDestination,
                Mode, LoadingPort,
                NotifyPartyName, Currency, 0, 0, selectQuery.replace(/,\s*$/, "") + ' FROM ', Direction.toLowerCase() + '_' + CountryName.toLowerCase(), false);

            db.query(query[0], query[1].slice(1), (err, results) => {
                if (!err) {
                    for (let i = 0; i < keys.length; i++) {
                        if (obj[keys[i]] == true) {
                            output[keys[i]] = [...new Set(extractValue(results.rows, keys[i]))];
                        }
                    }
                    // output.HSCODE = extractValue(results.rows,'HsCode');
                    // console.log(output);
                    return res.status(200).json(success("Ok", output, res.statusCode));
                } else {
                    return res.status(500).json(error(err.message, res.statusCode));
                }
            })
        }
    } catch (err) {
        return res.status(500).json(error(err, res.statusCode));
    };
}
exports.getfirstListofSidefilterdata = async (req, res) => {
    try {
        const { fromDate, toDate, HsCode, ProductDesc, Imp_Name, Exp_Name, CountryofOrigin,
            CountryofDestination, Month, Year, Currency, uqc, Quantity, PortofOrigin,
            PortofDestination,
            Mode, LoadingPort,
            NotifyPartyName, CountryCode, CountryName, Direction } = req.body;
        const access = await db.query(query.get_first_sidefilter_Access, [CountryCode, Direction.toUpperCase()]);
        var selectQuery = 'Distinct ';
        var output = {};
        if (access.rows.length > 0) {
            const keys = Object.keys(access.rows[0]);
            const obj = access.rows[0];
            if (Object.values(access.rows[0])
                .every(item => item === false)) {
                for (let i = 0; i < keys.length; i++) {
                    if (obj[keys[i]] == false) {
                        output[keys[i]] = [];
                    }
                }
                return res.status(200).json(success("Ok", output, res.statusCode));
            } else {
                for (let i = 0; i < keys.length; i++) {
                    if (obj[keys[i]] === true) {
                        selectQuery += '"' + keys[i] + '", '
                    }
                }

                const query = await common.getExportData(fromDate, toDate, HsCode, ProductDesc, Imp_Name, Exp_Name, CountryofOrigin,
                    CountryofDestination, Month, Year, uqc, Quantity, PortofOrigin,
                    PortofDestination,
                    Mode, LoadingPort,
                    NotifyPartyName, Currency, 0, 0, selectQuery.replace(/,\s*$/, "") + ' FROM ', Direction.toLowerCase() + '_' + CountryName.toLowerCase(), false);

                db.query(query[0], query[1].slice(1), (err, results) => {
                    if (!err) {
                        for (let i = 0; i < keys.length; i++) {
                            if (obj[keys[i]] == true) {
                                output[keys[i]] = [...new Set(extractValue(results.rows, keys[i]))];
                            }
                        }
                        // output.HSCODE = extractValue(results.rows,'HsCode');
                        // console.log(output);
                        return res.status(200).json(success("Ok", output, res.statusCode));
                    } else {
                        return res.status(500).json(error(err.message, res.statusCode));
                    }
                })
            }
        }
    } catch (err) {
        return res.status(500).json(error(err, res.statusCode));
    };
}
exports.getsecondListofSidefilterdata = async (req, res) => {
    try {
        const { fromDate, toDate, HsCode, ProductDesc, Imp_Name, Exp_Name, CountryofOrigin,
            CountryofDestination, Month, Year, Currency, uqc, Quantity, PortofOrigin,
            PortofDestination,
            Mode, LoadingPort,
            NotifyPartyName, CountryCode, CountryName, Direction } = req.body;
        const access = await db.query(query.get_second_sidefilter_Access, [CountryCode, Direction.toUpperCase()]);
        var selectQuery = 'Distinct ';
        var output = {};
        if (access.rows.length > 0) {
            const keys = Object.keys(access.rows[0]);
            const obj = access.rows[0];
            if (Object.values(access.rows[0])
                .every(item => item === false)) {
                for (let i = 0; i < keys.length; i++) {
                    if (obj[keys[i]] == false) {
                        output[keys[i]] = [];
                    }
                }
                return res.status(200).json(success("Ok", output, res.statusCode));
            } else {
                for (let i = 0; i < keys.length; i++) {
                    if (obj[keys[i]] === true) {
                        selectQuery += '"' + keys[i] + '", '
                    }
                }

                const query = await common.getExportData(fromDate, toDate, HsCode, ProductDesc, Imp_Name, Exp_Name, CountryofOrigin,
                    CountryofDestination, Month, Year, uqc, Quantity, PortofOrigin,
                    PortofDestination,
                    Mode, LoadingPort,
                    NotifyPartyName, Currency, 0, 0, selectQuery.replace(/,\s*$/, "") + ' FROM ', Direction.toLowerCase() + '_' + CountryName.toLowerCase(), false);

                db.query(query[0], query[1].slice(1), (err, results) => {
                    if (!err) {
                        for (let i = 0; i < keys.length; i++) {
                            if (obj[keys[i]] == true) {
                                output[keys[i]] = [...new Set(extractValue(results.rows, keys[i]))];
                            }
                        }
                        // output.HSCODE = extractValue(results.rows,'HsCode');
                        // console.log(output);
                        return res.status(200).json(success("Ok", output, res.statusCode));
                    } else {
                        return res.status(500).json(error(err.message, res.statusCode));
                    }
                })
            }
        }
    } catch (err) {
        return res.status(500).json(error(err, res.statusCode));
    };
}
exports.getthirdListofSidefilterdata = async (req, res) => {
    try {
        const { fromDate, toDate, HsCode, ProductDesc, Imp_Name, Exp_Name, CountryofOrigin,
            CountryofDestination, Month, Year, Currency, uqc, Quantity, PortofOrigin,
            PortofDestination,
            Mode, LoadingPort,
            NotifyPartyName, CountryCode, CountryName, Direction } = req.body;
        const access = await db.query(query.get_third_sidefilter_Access, [CountryCode, Direction.toUpperCase()]);
        var selectQuery = 'Distinct ';
        var output = {};
        if (access.rows.length > 0) {
            const keys = Object.keys(access.rows[0]);
            const obj = access.rows[0];
            if (Object.values(access.rows[0])
                .every(item => item === false)) {
                for (let i = 0; i < keys.length; i++) {
                    if (obj[keys[i]] == false) {
                        output[keys[i]] = [];
                    }
                }
                return res.status(200).json(success("Ok", output, res.statusCode));
            } else {
                for (let i = 0; i < keys.length; i++) {
                    if (obj[keys[i]] === true) {
                        selectQuery += '"' + keys[i] + '", '
                    }
                }

                const query = await common.getExportData(fromDate, toDate, HsCode, ProductDesc, Imp_Name, Exp_Name, CountryofOrigin,
                    CountryofDestination, Month, Year, uqc, Quantity, PortofOrigin,
                    PortofDestination,
                    Mode, LoadingPort,
                    NotifyPartyName, Currency, 0, 0, selectQuery.replace(/,\s*$/, "") + ' FROM ', Direction.toLowerCase() + '_' + CountryName.toLowerCase(), false);

                db.query(query[0], query[1].slice(1), (err, results) => {
                    if (!err) {
                        for (let i = 0; i < keys.length; i++) {
                            if (obj[keys[i]] == true) {
                                output[keys[i]] = [...new Set(extractValue(results.rows, keys[i]))];
                            }
                        }
                        // output.HSCODE = extractValue(results.rows,'HsCode');
                        // console.log(output);
                        return res.status(200).json(success("Ok", output, res.statusCode));
                    } else {
                        return res.status(500).json(error(err.message, res.statusCode));
                    }
                })
            }
        }
    } catch (err) {
        return res.status(500).json(error(err, res.statusCode));
    };
}
exports.getfourthListofSidefilterdata = async (req, res) => {
    try {
        const { fromDate, toDate, HsCode, ProductDesc, Imp_Name, Exp_Name, CountryofOrigin,
            CountryofDestination, Month, Year, Currency, uqc, Quantity, PortofOrigin,
            PortofDestination,
            Mode, LoadingPort,
            NotifyPartyName, CountryCode, CountryName, Direction } = req.body;
        const access = await db.query(query.get_fourth_sidefilter_Access, [CountryCode, Direction.toUpperCase()]);
        var selectQuery = 'Distinct ';
        var output = {};
        if (access.rows.length > 0) {
            const keys = Object.keys(access.rows[0]);
            const obj = access.rows[0];
            if (Object.values(access.rows[0])
                .every(item => item === false)) {
                for (let i = 0; i < keys.length; i++) {
                    if (obj[keys[i]] == false) {
                        output[keys[i]] = [];
                    }
                }
                return res.status(200).json(success("Ok", output, res.statusCode));
            } else {
                for (let i = 0; i < keys.length; i++) {
                    if (obj[keys[i]] === true) {
                        selectQuery += '"' + keys[i] + '", '
                    }
                }
                const query = await common.getExportData(fromDate, toDate, HsCode, ProductDesc, Imp_Name, Exp_Name, CountryofOrigin,
                    CountryofDestination, Month, Year, uqc, Quantity, PortofOrigin,
                    PortofDestination,
                    Mode, LoadingPort,
                    NotifyPartyName, Currency, 0, 0, selectQuery.replace(/,\s*$/, "") + ' FROM ', Direction.toLowerCase() + '_' + CountryName.toLowerCase(), false);

                db.query(query[0], query[1].slice(1), (err, results) => {
                    if (!err) {
                        for (let i = 0; i < keys.length; i++) {
                            if (obj[keys[i]] == true) {
                                output[keys[i]] = [...new Set(extractValue(results.rows, keys[i]))];
                            }
                        }
                        // output.HSCODE = extractValue(results.rows,'HsCode');
                        // console.log(output);
                        return res.status(200).json(success("Ok", output, res.statusCode));
                    } else {
                        return res.status(500).json(error(err.message, res.statusCode));
                    }
                })
            }
        }
    } catch (err) {
        return res.status(500).json(error(err, res.statusCode));
    };
}
exports.getImportListofSidefilterdata = async (req, res) => {
    try {
        const { fromDate, toDate, HsCode, ProductDesc, Imp_Name, Exp_Name, CountryofOrigin,
            CountryofDestination, Month, Year, Currency, uqc, Quantity, PortofOrigin,
            PortofDestination,
            Mode, LoadingPort,
            NotifyPartyName, CountryCode, CountryName, Direction } = req.body;
        const access = await db.query(query.get_Import_sidefilter_Access, [CountryCode, Direction.toUpperCase()]);
        var selectQuery = 'Distinct ';
        var output = {};
        if (access.rows.length > 0) {
            const keys = Object.keys(access.rows[0]);
            const obj = access.rows[0];
            if (Object.values(access.rows[0])
                .every(item => item === false)) {
                for (let i = 0; i < keys.length; i++) {
                    if (obj[keys[i]] == false) {
                        output[keys[i]] = [];
                    }
                }
                return res.status(200).json(success("Ok", output, res.statusCode));
            } else {
                for (let i = 0; i < keys.length; i++) {
                    if (obj[keys[i]] === true) {
                        selectQuery += '"' + keys[i] + '", '
                    }
                }

                const query = await common.getExportData(fromDate, toDate, HsCode, ProductDesc, Imp_Name, Exp_Name, CountryofOrigin,
                    CountryofDestination, Month, Year, uqc, Quantity, PortofOrigin,
                    PortofDestination,
                    Mode, LoadingPort,
                    NotifyPartyName, Currency, 0, 0, selectQuery.replace(/,\s*$/, "") + ' FROM ', Direction.toLowerCase() + '_' + CountryName.toLowerCase(), false);

                db.query(query[0], query[1].slice(1), (err, results) => {
                    if (!err) {
                        for (let i = 0; i < keys.length; i++) {
                            if (obj[keys[i]] == true) {
                                output[keys[i]] = [...new Set(extractValue(results.rows, keys[i]))];
                            }
                        }
                        // output.HSCODE = extractValue(results.rows,'HsCode');
                        // console.log(output);
                        return res.status(200).json(success("Ok", output, res.statusCode));
                    } else {
                        return res.status(500).json(error(err.message, res.statusCode));
                    }
                })
            }
        }
    } catch (err) {
        return res.status(500).json(error(err, res.statusCode));
    };
}
exports.getExportListofSidefilterdata = async (req, res) => {
    try {
        const { fromDate, toDate, HsCode, ProductDesc, Imp_Name, Exp_Name, CountryofOrigin,
            CountryofDestination, Month, Year, Currency, uqc, Quantity, PortofOrigin,
            PortofDestination,
            Mode, LoadingPort,
            NotifyPartyName, CountryCode, CountryName, Direction } = req.body;
        const access = await db.query(query.get_Export_sidefilter_Access, [CountryCode, Direction.toUpperCase()]);
        var selectQuery = 'Distinct ';
        var output = {};
        if (access.rows.length > 0) {
            const keys = Object.keys(access.rows[0]);
            const obj = access.rows[0];
            if (Object.values(access.rows[0])
                .every(item => item === false)) {
                for (let i = 0; i < keys.length; i++) {
                    if (obj[keys[i]] == false) {
                        output[keys[i]] = [];
                    }
                }
                return res.status(200).json(success("Ok", output, res.statusCode));
            } else {
                for (let i = 0; i < keys.length; i++) {
                    if (obj[keys[i]] === true) {
                        selectQuery += '"' + keys[i] + '", '
                    }
                }

                const query = await common.getExportData(fromDate, toDate, HsCode, ProductDesc, Imp_Name, Exp_Name, CountryofOrigin,
                    CountryofDestination, Month, Year, uqc, Quantity, PortofOrigin,
                    PortofDestination,
                    Mode, LoadingPort,
                    NotifyPartyName, Currency, 0, 0, selectQuery.replace(/,\s*$/, "") + ' FROM ', Direction.toLowerCase() + '_' + CountryName.toLowerCase(), false);

                db.query(query[0], query[1].slice(1), (err, results) => {
                    if (!err) {
                        for (let i = 0; i < keys.length; i++) {
                            if (obj[keys[i]] == true) {
                                output[keys[i]] = [...new Set(extractValue(results.rows, keys[i]))];
                            }
                        }
                        // output.HSCODE = extractValue(results.rows,'HsCode');
                        // console.log(output);
                        return res.status(200).json(success("Ok", output, res.statusCode));
                    } else {
                        return res.status(500).json(error(err.message, res.statusCode));
                    }
                })
            }
        }
    } catch (err) {
        return res.status(500).json(error(err, res.statusCode));
    };
}
exports.addnotification = async (req, res) => {
    try {
        const { message } = req.body;
        const date = utility.formatDate(new Date());
        db.query(query.add_notification, [message, date], (err, result) => {
            if (!err) {
                return res.status(200).json(success("Ok", "Insert Successfully !", res.statusCode));
            } else {
                return res.status(200).json(error(err.message, res.statusCode));
            }
        });
    } catch (err) {
        return res.status(500).json(error(err, res.statusCode));
    };
}
exports.getnotification = async (req, res) => {
    try {
        const { Id } = req.query;
        if (Id != null && Id != undefined) {
            db.query(query.get_notification, [Id], (err, result) => {
                if (!err) {
                    return res.status(200).json(success("Ok", result.rows, res.statusCode));
                } else {
                    return res.status(200).json(error(err.message, res.statusCode));
                }
            });
        } else {
            db.query(query.get_notification_all, (err, result) => {
                if (!err) {
                    return res.status(200).json(success("Ok", result.rows, res.statusCode));
                } else {
                    return res.status(200).json(error(err.message, res.statusCode));
                }
            });
        }
    } catch (err) {
        return res.status(500).json(error(err, res.statusCode));
    };
}
exports.getcounts = async (req, res) => {
    try {
        const { fromDate, toDate, HsCode, ProductDesc, Imp_Name, Exp_Name, CountryofOrigin,
            CountryofDestination, Month, Year, Currency, uqc, Quantity, PortofOrigin,
            PortofDestination,
            Mode, LoadingPort,
            NotifyPartyName, UserId, IsWorkspaceSearch = false,
            page, itemperpage, direction, countryname } = req.body;
        var result = { counters: {}};
        const counterquery = await common.getExportData(fromDate, toDate, HsCode, ProductDesc, Imp_Name, Exp_Name, CountryofOrigin,
            CountryofDestination, Month, Year, uqc, Quantity, PortofOrigin,
            PortofDestination,
            Mode, LoadingPort,
            NotifyPartyName, Currency, page, itemperpage, await common.getavailableFieldlist(direction+'_'+countryname), direction+'_'+countryname, false);

        db.query(counterquery[0], counterquery[1].slice(1), (err, results) => {
            if (!err) {
                result.counters = results.rows[0];
                return res.status(200).json(success("Ok", result, res.statusCode));
            } else {
                return res.status(500).json(error(err, res.statusCode));
            }
        })
    } catch (ex) {
        return res.status(500).json(error("Internal server error", res.statusCode));
    }
}
exports.getAlertMessage = async (req, res) => {
    try {
        const { Id } = req.query;
        db.query(query.get_alert_message, [Id], (err, result) => {
            if (!err) {
                return res.status(200).json(success("Ok", result.rows, res.statusCode));
            } else {
                return res.status(200).json(error(err.message, res.statusCode));
            }
        });
    } catch (err) {
        return res.status(500).json(error(err, res.statusCode));
    };
}

exports.updateUserPreference = async (req, res) => {
    try {
        const { Email, userPreference } = req.body;
        db.query(query.update_userPreferences, [Email, userPreference], (err, result) => {
            if (!err) {
                return res.status(200).json(success("Ok", result.rows, res.statusCode));
            } else {
                return res.status(200).json(error(err.message, res.statusCode));
            }
        });
    } catch (err) {
        return res.status(500).json(error(err, res.statusCode));
    };
}

exports.getProductDesc = async (req, res) => {
    try {
        const { product } = req.query;
        db.query('SELECT * FROM public."Products" WHERE "Product" LIKE $1', [product + '%'], (err, result) => {
            return res.status(200).json(success("Ok", result.rows, res.statusCode));
        });
    } catch (err) {
        return res.status(500).json(error(err, res.statusCode));
    };
}

exports.getexportlistbyAlphabet = async (req, res) => {
    try {
        const { alphabet, countryname, direction, columnname } = req.body;
        const fieldList = ["Imp_Name", "Exp_Name"];
        const availablefield = await db.query('SELECT column_name FROM information_schema.columns WHERE table_name = $1 and column_name = ANY($2)', [direction.toLowerCase() + '_' + countryname.toLowerCase(), fieldList]);
        if (availablefield.rows.length > 0) {
            if (columnname == 'Imp_Name') {
                if (direction.toLowerCase() == 'import') {
                    db.query(query.getimporter_import_india_search, [alphabet + '%'], (err, result) => {
                        return res.status(200).json(success("Ok", result.rows, res.statusCode));
                    });
                } else {
                    db.query(query.getimporter_export_india_search, [alphabet + '%'], (err, result) => {
                        return res.status(200).json(success("Ok", result.rows, res.statusCode));
                    });
                }

            } else if (columnname == 'Exp_Name') {
                if (direction.toLowerCase() == 'import') {
                    db.query(query.getexporter_import_india_search, [alphabet + '%'], (err, result) => {
                        return res.status(200).json(success("Ok", result.rows, res.statusCode));
                    });
                } else {
                    db.query(query.getexporter_export_india_search, [alphabet + '%'], (err, result) => {
                        return res.status(200).json(success("Ok", result.rows, res.statusCode));
                    });
                }
            } else {
                return res.status(200).json(success("Ok", "Field not available", res.statusCode));
            }
        } else {
            return res.status(200).json(success("Ok", "This Field not available", res.statusCode));
        }
    } catch (err) {
        return res.status(500).json(error(err, res.statusCode));
    };
}

function extractValue(arr, prop) {
    // extract value from property
    let extractedValue = arr.map(item => item[prop]);
    return extractedValue;
}