const { response } = require('express');
const db = require('../../src/utils/database');
const { validationResult } = require('express-validator');
const { success, error, validation } = require('../../src/utils/response');
const query = require('../../src/sql/queries');
const utility = require('../utils/utility');
const common = require('../utils/common');
const config = require('../utils/config');
const Stream = require('stream');
const ExcelJs = require('exceljs');
const AWS = require('aws-sdk');
const fs = require('fs');
// require('dotenv').config();
const region = "us-east-1";

// Creating a Secrets Manager client
const client = new AWS.SecretsManager({ region: region });


const s3 = new AWS.S3();

exports.saveDownload = async (req, res) => {
    try {
        const { countrycode, userId, direction, recordIds, workspacename } = req.body;
        const datetime = new Date();
        const workspace = await db.query(query.check_download_workspancename, [workspacename]);
        if (workspace.rows.length == 0) {
            const recordtobill = await db.query('select Count(elements) as totalrecordtobill from (select unnest(array[' + recordIds.toString() + ']) except select unnest("recordIds") FROM public.userdownloadtransaction where "userId"=$1) t (elements)', [userId]);

            db.query(query.add_download_workspace, [countrycode, userId, direction.toUpperCase(), recordIds, workspacename, datetime, '', '', ''], async (err, result) => {
                if (!err) {
                    await Deductdownload(recordtobill.rows[0].totalrecordtobill, countrycode, userId);
                    return res.status(201).json(success("Ok", result.command + " Successful.", res.statusCode));
                } else {
                    return res.status(201).json(success("Ok", err.message, res.statusCode));
                }
            });

        } else {
            return res.status(200).json(error("workspace name already exists"));
        }

    } catch (err) {
        return res.status(500).json(error(err, res.statusCode));
    };
}

exports.getDownloadworkspace = async (req, res) => {
    try {
        const { userId } = req.query;
        db.query(query.get_download_Workspace, [userId], (err, result) => {
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
exports.sharedownloadfile = async (req, res) => {
    try {
        const { WorkspaceId, UserIdto, UserIdBy } = req.body;
        const datetime = new Date();
        if (WorkspaceId.length > 0) {
            WorkspaceId.forEach(workspcid => {
                if (UserIdto.length > 0) {
                    UserIdto.forEach(element => {
                        db.query(query.share_download_files, [element, workspcid, datetime], (err, result) => {
                            if (!err) {
                                db.query(query.insert_share_history, [UserIdBy, element, datetime, workspcid], (err, result) => {
                                    if (!err) {
                                        // return res.status(200).json(success("Ok", result.command + " Successful.", res.statusCode));
                                    }
                                })

                            } else {
                                return res.status(200).json(success("Ok", err.message, res.statusCode));
                            }
                        });
                    });

                } else {
                    return res.status(200).json(success("Ok", "Please pass to userid to share the workspace.", res.statusCode));
                }
            });
            return res.status(200).json(success("Ok", "Insert Successful.", 200));
        } else {
            return res.status(200).json(success("Ok", "Please pass at least one workspace id to share !", res.statusCode));
        }
    } catch (err) {
        return res.status(500).json(error(err, res.statusCode));
    };
}
exports.getdownloaddata = async (req, res) => {
    try {
        const { direction, recordIds, country } = req.body;
        db.query('SELECT * FROM public.' + direction.toLowerCase() + '_' + country.toLowerCase() + ' WHERE "RecordID" IN (' + recordIds.toString() + ')', (err, result) => {
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

exports.generateDownloadfiles = async (req, res) => {

    const { fromDate, toDate, HsCode, ProductDesc, Imp_Name, Exp_Name, CountryofOrigin,
        CountryofDestination, Month, Year, Currency, uqc, Quantity, PortofOrigin,
        PortofDestination,
        Mode, LoadingPort,
        NotifyPartyName, UserId, recordIds, CountryCode, CountryName, direction, filename } = req.body;
    // Getting secret value from ASM
    const secret = await client.getSecretValue({ SecretId: `cypher-access-key` }).promise();
    // Prasing SecretString into javascript object
    const secretData = JSON.parse(secret.SecretString);
    AWS.config.update({
        accessKeyId: secretData.AccessKey,
        secretAccessKey: secretData.Secretaccesskey
    });
    const planDetails = await db.query(query.get_Plan_By_UserId, [UserId]);
    const datetime = new Date();
    if (planDetails.rows[0] != null) {
        if (recordIds.length == 0) {
            const finalquery = await common.getExportData(fromDate, toDate, HsCode, ProductDesc, Imp_Name, Exp_Name, CountryofOrigin,
                CountryofDestination, Month, Year, uqc, Quantity, PortofOrigin,
                PortofDestination,
                Mode, LoadingPort,
                NotifyPartyName, Currency, 0, 0, getquery(direction, CountryCode), direction.toLowerCase() + '_' + CountryName.toLowerCase(), false);

            db.query(finalquery[0], finalquery[1].slice(1), async (error, result) => {

                if (!error) {
                    const recordIds = result.rows.map(x => x.RecordID);

                    const recordtobill = await GetRecordToBill(recordIds, UserId);
                    //const pointdeducted = await Deductdownload(recordtobill.rows[0].totalrecordtobill, CountryCode, UserId);
                    const planDetails = await db.query(query.get_Plan_By_UserId, [UserId]);
                    if (planDetails.rows[0] != null) {
                        db.query(query.get_download_cost, [CountryCode], async (err, results) => {
                            if (!err) {
                                const totalpointtodeduct = (parseInt(planDetails.rows[0].Downloads) - (parseInt(results.rows[0].CostPerRecord) * parseInt(recordtobill.rows[0].totalrecordtobill)));

                                if (totalpointtodeduct > 0) {

                                    const stream = new Stream.PassThrough();
                                    const workbook = new ExcelJs.stream.xlsx.WorkbookWriter({
                                        stream: stream,
                                    });
                                    // Define worksheet
                                    const worksheet = workbook.addWorksheet('Data');
                                    // remove recordID from array 
                                    result.rows.forEach(function (tmp) { delete tmp.RecordID });
                                    // Set column headers
                                    worksheet.columns = getDataHeaders(result.rows[0]);
                                    result.rows.forEach((row) => {
                                        // recordIds.push(row.RecordID);
                                        worksheet.addRow(row).commit();
                                    });
                                    // Commit all changes
                                    worksheet.commit();
                                    workbook.commit();
                                    // Upload to s3

                                    const params = {
                                        Bucket: 'cypher-download-files',
                                        Key: `${filename}.xlsx`,
                                        Body: stream
                                    }
                                    s3.upload(params, async (err, data) => {
                                        if (err) {
                                            reject(err)
                                        }
                                        // resolve(data.Location)
                                        db.query(query.update_download_count, [totalpointtodeduct, UserId], (err, result) => {

                                        });
                                        db.query(query.add_download_workspace, [CountryCode, UserId, direction.toUpperCase(), recordIds, filename, datetime, data.Location, 'Completed', error], async (err, result) => {
                                            return res.status(201).json(success("Ok", result.command + " Successful.", res.statusCode));
                                        });
                                    })
                                } else {
                                    return res.status(201).json(success("Ok", "Don't have enough balance to download these records !", res.statusCode));
                                }
                            }
                        });
                    }
                } else {
                    return res.status(201).json(success("Ok", "No Record found to download", res.statusCode));
                }
            })

        } else {
            const qry = 'select ' + getquery(direction, CountryCode) + ' ' + direction.toLowerCase() + '_' + CountryName.toLowerCase() + ' where "RecordID" IN (' + recordIds + ')';
            db.query(qry, async (errs, result) => {
                const recordtobill = await GetRecordToBill(recordIds, UserId);
                //const pointdeducted = await Deductdownload(recordtobill.rows[0].totalrecordtobill, CountryCode, UserId);
                const planDetails = await db.query(query.get_Plan_By_UserId, [UserId]);
                if (planDetails.rows[0] != null) {
                    db.query(query.get_download_cost, [CountryCode], async (error, results) => {
                        if (!error) {
                            const totalpointtodeduct = (parseInt(planDetails.rows[0].Downloads) - (parseInt(results.rows[0].CostPerRecord) * parseInt(recordtobill.rows[0].totalrecordtobill)));

                            if (totalpointtodeduct > 0) {

                                const stream = new Stream.PassThrough();
                                const workbook = new ExcelJs.stream.xlsx.WorkbookWriter({
                                    stream: stream,
                                });
                                // Define worksheet
                                const worksheet = workbook.addWorksheet('Data');
                                // remove recordID from array 
                                result.rows.forEach(function (tmp) { delete tmp.RecordID });
                                // Set column headers
                                worksheet.columns = getDataHeaders(result.rows[0]);
                                result.rows.forEach((row) => {
                                    // recordIds.push(row.RecordID);
                                    worksheet.addRow(row).commit();
                                });
                                // Commit all changes
                                worksheet.commit();
                                workbook.commit();
                                // Upload to s3

                                const params = {
                                    Bucket: 'cypher-download-files',
                                    Key: `${filename}.xlsx`,
                                    Body: stream
                                }
                                await s3.upload(params, async (err, data) => {
                                    if (err) {
                                        reject(err)
                                    }
                                    // resolve(data.Location)
                                    db.query(query.update_download_count, [totalpointtodeduct, UserId], (err, result) => {

                                    });
                                    db.query(query.add_download_workspace, [CountryCode, UserId, direction.toUpperCase(), recordIds, filename, datetime, data.Location, 'Completed', errs], async (err, result) => {
                                        return res.status(201).json(success("Ok", result.command + " Successful.", res.statusCode));
                                    });
                                })
                            } else {
                                return res.status(201).json(success("Ok", "Don't have enough balance to download these records !", res.statusCode));
                            }
                        }
                    });
                }
            })

        }
    }
}

exports.generateDownloadbigfiles = async (req, res) => {

    const { fromDate, toDate, HsCode, ProductDesc, Imp_Name, Exp_Name, CountryofOrigin,
        CountryofDestination, Month, Year, Currency, uqc, Quantity, PortofOrigin,
        PortofDestination,
        Mode, LoadingPort,
        NotifyPartyName, UserId, recordIds, CountryCode, CountryName, direction, filename } = req.body;
    // Getting secret value from ASM
    const secret = await client.getSecretValue({ SecretId: `cypher-access-key` }).promise();
    // Prasing SecretString into javascript object
    const secretData = JSON.parse(secret.SecretString);
    AWS.config.update({
        accessKeyId: secretData.AccessKey,
        secretAccessKey: secretData.Secretaccesskey
    });
    const planDetails = await db.query(query.get_Plan_By_UserId, [UserId]);
    const datetime = new Date();
    if (planDetails.rows[0] != null) {
        if (recordIds.length == 0) {
            const finalquery = await common.getExportData(fromDate, toDate, HsCode, ProductDesc, Imp_Name, Exp_Name, CountryofOrigin,
                CountryofDestination, Month, Year, uqc, Quantity, PortofOrigin,
                PortofDestination,
                Mode, LoadingPort,
                NotifyPartyName, Currency, 0, 0, getquery(direction, CountryCode), direction.toLowerCase() + '_' + CountryName.toLowerCase(), false);


            db.query(query.add_download_workspace, [CountryCode, UserId, direction.toUpperCase(), {}, filename, datetime, '', 'In-Progress', ''], async (err, result) => {
                await calllongquery(finalquery, UserId, CountryCode, direction, filename, datetime, result.rows[0].Id);
                return res.status(201).json(success("Ok", result.command + " Successful.", res.statusCode));
            });
            // return res.status(201).json(success("Ok", " insert Successful.", res.statusCode));
        } else {
            const qry = 'select ' + getquery(direction, CountryCode) + ' ' + direction.toLowerCase() + '_' + CountryName.toLowerCase() + ' where "RecordID" IN (' + recordIds + ')';
            db.query(qry, async (err, result) => {
                const recordtobill = await GetRecordToBill(recordIds, UserId);
                //const pointdeducted = await Deductdownload(recordtobill.rows[0].totalrecordtobill, CountryCode, UserId);
                const planDetails = await db.query(query.get_Plan_By_UserId, [UserId]);
                if (planDetails.rows[0] != null) {
                    db.query(query.get_download_cost, [CountryCode], async (err, results) => {
                        if (!err) {
                            const totalpointtodeduct = (parseInt(planDetails.rows[0].Downloads) - (parseInt(results.rows[0].CostPerRecord) * parseInt(recordtobill.rows[0].totalrecordtobill)));

                            if (totalpointtodeduct > 0) {

                                const stream = new Stream.PassThrough();
                                const workbook = new ExcelJs.stream.xlsx.WorkbookWriter({
                                    stream: stream,
                                });
                                // Define worksheet
                                const worksheet = workbook.addWorksheet('Data');
                                // remove recordID from array 
                                result.rows.forEach(function (tmp) { delete tmp.RecordID });
                                // Set column headers
                                worksheet.columns = getDataHeaders(result.rows[0]);
                                result.rows.forEach((row) => {
                                    // recordIds.push(row.RecordID);
                                    worksheet.addRow(row).commit();
                                });
                                // Commit all changes
                                worksheet.commit();
                                workbook.commit();
                                // Upload to s3

                                const params = {
                                    Bucket: 'cypher-download-files',
                                    Key: `${filename}.xlsx`,
                                    Body: stream
                                }
                                await s3.upload(params, async (err, data) => {
                                    if (err) {
                                        reject(err)
                                    }
                                    // resolve(data.Location)
                                    db.query(query.update_download_count, [totalpointtodeduct, UserId], (err, result) => {

                                    });
                                    db.query(query.add_download_workspace, [CountryCode, UserId, direction.toUpperCase(), recordIds, filename, datetime, data.Location, 'Completed', ''], async (err, result) => {
                                        return res.status(201).json(success("Ok", result.command + " Successful.", res.statusCode));
                                    });
                                })
                            } else {
                                return res.status(201).json(success("Ok", "Don't have enough balance to download these records !", res.statusCode));
                            }
                        }
                    });
                }
            })

        }
    }
}

exports.generateDownloadbigfilesforalluser = async (req, res) => {

    const { fromDate, toDate, HsCode, ProductDesc, Imp_Name, Exp_Name, CountryofOrigin,
        CountryofDestination, Month, Year, Currency, uqc, Quantity, PortofOrigin,
        PortofDestination,
        Mode, LoadingPort,
        NotifyPartyName, UserId, recordIds, CountryCode, CountryName, direction, filename } = req.body;
    let isSubUser = false;
    let parentuserid = 0;
    let subUserId = 0;
    const user = await db.query(query.get_cypher_userby_id, [UserId]);
    if (user.rows.length > 0) {
        if (user.rows[0].ParentUserId != null) {
            isSubUser = true;
            parentuserid = user.rows[0].ParentUserId;
            subUserId = user.rows[0].UserId;
        }
    }
    // Getting secret value from ASM
    const secret = await client.getSecretValue({ SecretId: `cypher-access-key` }).promise();
    // Prasing SecretString into javascript object
    const secretData = JSON.parse(secret.SecretString);
    AWS.config.update({
        accessKeyId: secretData.AccessKey,
        secretAccessKey: secretData.Secretaccesskey
    });
    const planDetails = await db.query(query.get_Plan_By_UserId, [isSubUser ? parentuserid : UserId]);
    const datetime = new Date();
    if (planDetails.rows[0] != null) {
        if (recordIds.length == 0) {
            const finalquery = await common.getExportData(fromDate, toDate, HsCode, ProductDesc, Imp_Name, Exp_Name, CountryofOrigin,
                CountryofDestination, Month, Year, uqc, Quantity, PortofOrigin,
                PortofDestination,
                Mode, LoadingPort,
                NotifyPartyName, Currency, 0, 0, getquery(direction, CountryCode), direction.toLowerCase() + '_' + CountryName.toLowerCase(), false);


            db.query(query.add_download_workspace, [CountryCode, isSubUser ? subUserId : UserId, direction.toUpperCase(), {}, filename, datetime, '', 'In-Progress', ''], async (err, result) => {
                await calllongquery(finalquery, isSubUser ? parentuserid : UserId, CountryCode, direction, filename, datetime, result.rows[0].Id);
                return res.status(201).json(success("Ok", result.command + " Successful.", res.statusCode));
            });
            // return res.status(201).json(success("Ok", " insert Successful.", res.statusCode));
        } else {
            const qry = 'select ' + getquery(direction, CountryCode) + ' ' + direction.toLowerCase() + '_' + CountryName.toLowerCase() + ' where "RecordID" IN (' + recordIds + ')';
            db.query(qry, async (err, result) => {
                const recordtobill = await GetRecordToBill(recordIds, isSubUser ? parentuserid : UserId);
                //const pointdeducted = await Deductdownload(recordtobill.rows[0].totalrecordtobill, CountryCode, UserId);
                const planDetails = await db.query(query.get_Plan_By_UserId, [isSubUser ? parentuserid : UserId]);
                if (planDetails.rows[0] != null) {
                    db.query(query.get_download_cost, [CountryCode], async (err, results) => {
                        if (!err) {
                            const totalpointtodeduct = (parseInt(planDetails.rows[0].Downloads) - (parseInt(results.rows[0].CostPerRecord) * parseInt(recordtobill.rows[0].totalrecordtobill)));

                            if (totalpointtodeduct > 0) {

                                const stream = new Stream.PassThrough();
                                const workbook = new ExcelJs.stream.xlsx.WorkbookWriter({
                                    stream: stream,
                                });
                                // Define worksheet
                                const worksheet = workbook.addWorksheet('Data');
                                // remove recordID from array 
                                result.rows.forEach(function (tmp) { delete tmp.RecordID });
                                // Set column headers
                                worksheet.columns = getDataHeaders(result.rows[0]);
                                result.rows.forEach((row) => {
                                    // recordIds.push(row.RecordID);
                                    worksheet.addRow(row).commit();
                                });
                                // Commit all changes
                                worksheet.commit();
                                workbook.commit();
                                // Upload to s3

                                const params = {
                                    Bucket: 'cypher-download-files',
                                    Key: `${filename}.xlsx`,
                                    Body: stream
                                }
                                await s3.upload(params, async (err, data) => {
                                    if (err) {
                                        reject(err)
                                    }
                                    // resolve(data.Location)
                                    db.query(query.update_download_count, [totalpointtodeduct, isSubUser ? parentuserid : UserId], (err, result) => {

                                    });
                                    db.query(query.add_download_workspace, [CountryCode, isSubUser ? subUserId : UserId, direction.toUpperCase(), recordIds, filename, datetime, data.Location, 'Completed', ''], async (err, result) => {
                                        return res.status(201).json(success("Ok", result.command + " Successful.", res.statusCode));
                                    });
                                })
                            } else {
                                return res.status(201).json(success("Ok", "Don't have enough balance to download these records !", res.statusCode));
                            }
                        }
                    });
                }
            })

        }
    }
}

async function calllongquery(finalquery, UserId, CountryCode, direction, filename, datetime, id) {
    db.query(finalquery[0], finalquery[1].slice(1), async (error, result) => {
        if (!error) {
            if (result.rows.length < 500000) {
                const recordIds = result.rows.map(x => x.RecordID);

                const recordtobill = await GetRecordToBill(recordIds, UserId);
                //const pointdeducted = await Deductdownload(recordtobill.rows[0].totalrecordtobill, CountryCode, UserId);
                const planDetails = await db.query(query.get_Plan_By_UserId, [UserId]);
                if (planDetails.rows[0] != null) {
                    db.query(query.get_download_cost, [CountryCode], async (err, results) => {
                        if (!err) {
                            const totalpointtodeduct = (parseInt(planDetails.rows[0].Downloads) - (parseInt(results.rows[0].CostPerRecord) * parseInt(recordtobill.rows[0].totalrecordtobill)));

                            if (totalpointtodeduct > 0) {

                                const stream = new Stream.PassThrough();
                                const workbook = new ExcelJs.stream.xlsx.WorkbookWriter({
                                    stream: stream,
                                });
                               // const workbook = new ExcelJs.Workbook();
                                // Define worksheet
                                const worksheet = workbook.addWorksheet('Data');

                                // remove recordID from array 
                                result.rows.forEach(function (tmp) { delete tmp.RecordID });
                                // Set column headers
                                worksheet.columns = getDataHeaders(result.rows[0]);
                                worksheet.columns.forEach(column => {
                                    //column.font.bold = true;
                                    if (column.header == 'ITEM DESCRIPTION') {
                                        column.width = 125;
                                    } else if (column.header == 'VENDOR') {
                                        column.width = 40;
                                    } else if (column.header == 'BUYER') {
                                        column.width = 50;
                                    } else if (column.header == 'BUYER ADDRESS') {
                                        column.width = 100;
                                    } else {
                                        column.width = column.header.length < 12 ? 14 : column.header.length + 15
                                    }
                                })
                                // Add autofilter on each column
                                worksheet.autoFilter = 'A1:AH1';
                                result.rows.forEach((row, index) => {
                                    
                                    worksheet.addRow(row).commit();
                                });

                                // Process each row for beautification 
                                // worksheet.eachRow(function (row, rowNumber) {

                                //     row.eachCell((cell, colNumber) => {
                                //         if (rowNumber == 1) {
                                //             // First set the background of header row
                                //             cell.fill = {
                                //                 type: 'pattern',
                                //                 pattern: 'solid',
                                //                 fgColor: { argb: 'f6be00' }
                                //             }
                                //         }
                                //         // Set border of each cell 
                                //         cell.border = {
                                //             top: { style: 'thin' },
                                //             left: { style: 'thin' },
                                //             bottom: { style: 'thin' },
                                //             right: { style: 'thin' }
                                //         };
                                //     })
                                //     //Commit the changed row to the stream
                                //     row.commit();
                                // });
                               // await workbook.xlsx.writeFile(`${filename}.xlsx`);
                                // Commit all changes
                                worksheet.commit();
                                workbook.commit();
                                // Upload to s3
                                //const fileContent = fs.readFileSync(`${filename}.xlsx`)
                                const params = {
                                    Bucket: 'cypher-download-files',
                                    Key: `${filename}.xlsx`,
                                    Body: stream
                                }
                               // fs.unlinkSync(`${filename}.xlsx`);
                                s3.upload(params, async (err, data) => {
                                    if (err) {
                                        reject(err)
                                    }
                                    // resolve(data.Location)
                                    db.query(query.update_download_count, [totalpointtodeduct, UserId], (err, result) => {

                                    });
                                    db.query(query.update_download_workspace, [recordIds, data.Location, 'Completed', '', id], async (err, result) => {
                                        
                                    });
                                })
                            } else {
                                db.query(query.update_download_workspace, [{}, '', 'Error', 'Dont have enough balance to download these records !', id], async (err, result) => {
                                });
                            }
                        } else {
                            db.query(query.update_download_workspace, [{}, '', 'Error', err, id], async (err, result) => {
                            });
                        }
                    });
                }
            } else {
                db.query(query.update_download_workspace, [{}, '', 'Error', 'Can not download more than 5 Lacs records', id], async (err, result) => {
                });
            }
        } else {
            db.query(query.update_download_workspace, [{}, '', 'Error', error, id], async (err, result) => {
            });
        }
    })
}
async function Deductdownload(recordtobill, countrycode, userId) {
    const planDetails = await db.query(query.get_Plan_By_UserId, [userId]);
    if (planDetails.rows[0] != null) {
        db.query(query.get_download_cost, [countrycode], (err, result) => {
            if (!err) {
                const totalpointtodeduct = (planDetails.rows[0].Downloads - (result.rows[0].CostPerRecord * recordtobill));
                db.query(query.update_download_count, [totalpointtodeduct, userId], (err, result) => {

                });
            }
        });
    }
}
function getquery(direction, CountryCode) {
    if (CountryCode == 'IND') {
        if (direction.toLowerCase() == 'export') {
            return config.india_export_query;
        } else {
            return config.india_import_query;
        }
    } else {
        return config.select_all_to_download;
    }
}
async function GetRecordToBill(recordIds, userId) {
    const query = 'select Count(elements) as totalrecordtobill from (select unnest(array[' + recordIds.toString() + ']) except select unnest("recordIds") FROM public.userdownloadtransaction where "userId"=$1) t (elements)';
    const recordtobill = await db.query(query, [userId]);
    return recordtobill;
}

async function uploadSingleSheetToS3(excelData, filename) {
    const stream = new Stream.PassThrough();
    const workbook = new ExcelJs.stream.xlsx.WorkbookWriter({
        stream: stream,
    });
    // Define worksheet
    const worksheet = workbook.addWorksheet('Data');

    // Set column headers
    worksheet.columns = getDataHeaders(excelData[0]);
    excelData.forEach((row) => {
        worksheet.addRow(row).commit();
    });
    // Commit all changes
    worksheet.commit();
    workbook.commit();
    // Upload to s3

    const params = {
        Bucket: 'cypher-download-files',
        Key: `${filename}.xlsx`,
        Body: stream
    }
    await s3.upload(params, (err, data) => {
        if (err) {
            reject(err)
        }
        // resolve(data.Location)
        return data;
    })
    // await s3
    //     .upload({
    //         Bucket: process.env.AWS_BUCKET_NAME, // Put your bucket name,
    //         Key: `${filename}.xlsx`, // File key here,.xlsx
    //         Body: stream, // the stream defined above.
    //     })
    //     .promise();

    // Done
}

function getDataHeaders(row) {
    let columns = [];
    for (const prop in row) {
        columns.push({
            header: prop,
            key: prop,
        });
    }
    return columns;
}