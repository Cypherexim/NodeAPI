const { response } = require('express');
const db = require('../../src/utils/database');
const { validationResult } = require('express-validator');
const { success, error, validation } = require('../../src/utils/response');
const query = require('../../src/sql/queries');
const utility = require('../utils/utility');
const common = require('../utils/common');
const Stream = require('stream');
const ExcelJs = require('exceljs');
const AWS = require('aws-sdk');
// require('dotenv').config()
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

            db.query(query.add_download_workspace, [countrycode, userId, direction.toUpperCase(), recordIds, workspacename, datetime, ''], async (err, result) => {
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
    const secret = await client.getSecretValue({ SecretId: `prod-secret-key` }).promise();
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
            const query = await common.getExportData(fromDate, toDate, HsCode, ProductDesc, Imp_Name, Exp_Name, CountryofOrigin,
                CountryofDestination, Month, Year, uqc, Quantity, PortofOrigin,
                PortofDestination,
                Mode, LoadingPort,
                NotifyPartyName, Currency, page, itemperpage, config.select_Query_for_totalrecords, direction.toLowerCase() + '_' + CountryName.toLowerCase(), false);

            db.query(query[0], query[1].slice(1), (error, result) => {
                db.query(qry, async (err, result) => {
                    const stream = new Stream.PassThrough();
                    const workbook = new ExcelJs.stream.xlsx.WorkbookWriter({
                        stream: stream,
                    });
                    // Define worksheet
                    const worksheet = workbook.addWorksheet('Data');

                    // Set column headers
                    worksheet.columns = getDataHeaders(result.rows[0]);
                    result.rows.forEach((row) => {
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
                        const recordtobill = await GetRecordToBill(recordIds, UserId);
                        await Deductdownload(recordtobill.rows[0].totalrecordtobill, CountryCode, UserId);
                        db.query(query.add_download_workspace, [CountryCode, UserId, direction.toUpperCase(), recordIds, filename, datetime, data.Location], async (err, result) => {
                            return res.status(201).json(success("Ok", result.command + " Successful.", res.statusCode));
                        });
                    })
                })

            })
        } else {
            const qry = 'select * from ' + direction.toLowerCase() + '_' + CountryName.toLowerCase() + ' where "RecordID" IN (' + recordIds + ')';
            db.query(qry, async (err, result) => {
                const stream = new Stream.PassThrough();
                const workbook = new ExcelJs.stream.xlsx.WorkbookWriter({
                    stream: stream,
                });
                // Define worksheet
                const worksheet = workbook.addWorksheet('Data');

                // Set column headers
                worksheet.columns = getDataHeaders(result.rows[0]);
                result.rows.forEach((row) => {
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
                    const recordtobill = await GetRecordToBill(recordIds, UserId);
                    await Deductdownload(recordtobill.rows[0].totalrecordtobill, CountryCode, UserId);
                    db.query(query.add_download_workspace, [CountryCode, UserId, direction.toUpperCase(), recordIds, filename, datetime, data.Location], async (err, result) => {
                        return res.status(201).json(success("Ok", result.command + " Successful.", res.statusCode));
                    });
                })
            })
        }
    }
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