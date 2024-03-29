const db = require('../../src/utils/database');
const { success, error } = require('../../src/utils/response');
const query = require('../../src/sql/queries');
const utility = require('../utils/utility');
const common = require('../utils/common');
const config = require('../utils/config');
const Stream = require('stream');
const ExcelJs = require('exceljs');
const AWS = require('aws-sdk');
const {template} = require('../utils/mail-templates/download-mail');
const mail = require('../utils/mailing');
//const fs = require('fs');
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
            const date1 = new Date();
            db.query(query.add_download_workspace, [countrycode, userId, direction.toUpperCase(), recordIds, workspacename, datetime, '', '', '',date1], async (err, result) => {
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
                    UserIdto.forEach(async element => {
                       await db.query(query.share_download_files, [element, workspcid, datetime], async (error, result) => {
                            if (!error) {
                               await db.query(query.insert_share_history, [UserIdBy, element, datetime, workspcid], (errs, results) => {
                                    if (!errs) {
                                         //return res.status(200).json(success("Ok", results.command + " Successful.", res.statusCode));
                                    }
                                })

                            } else {
                                return res.status(200).json(success("Ok", error.message, res.statusCode));
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
                                        const date1 = new Date();
                                        db.query(query.add_download_workspace, [CountryCode, UserId, direction.toUpperCase(), recordIds, filename, datetime, data.Location, 'Completed', error,date1], async (err, result) => {
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
                                    const date1 = new Date();
                                    db.query(query.add_download_workspace, [CountryCode, UserId, direction.toUpperCase(), recordIds, filename, datetime, data.Location, 'Completed', errs,date1], async (err, result) => {
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

                const date1 = new Date();
            db.query(query.add_download_workspace, [CountryCode, UserId, direction.toUpperCase(), {}, filename, datetime, '', 'In-Progress', '',date1], async (err, result) => {
                await calllongquery(finalquery, UserId, CountryCode, direction, filename, datetime, result.rows[0].Id, fromDate, toDate, HsCode);
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
                                    const date1 = new Date();
                                    db.query(query.add_download_workspace, [CountryCode, UserId, direction.toUpperCase(), recordIds, filename, datetime, data.Location, 'Completed', date1], async (err, result) => {
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

            const date1 = new Date();
            db.query(query.add_download_workspace, [CountryCode, isSubUser ? subUserId : UserId, direction.toUpperCase(), {}, filename, datetime, '', 'In-Progress', '',date1], async (err, result) => {
                await calllongquery(finalquery, isSubUser ? parentuserid : UserId, CountryCode, direction, filename, datetime, result.rows[0].Id, fromDate, toDate, HsCode);
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
                                    useStyles: true,
                                    useSharedStrings: true,
                                });
                                // workbook.media.push({
                                //     filename: './cypher_logo.png',
                                //     extension: 'png',
                                //   })
                                // Define worksheet
                                const worksheet = workbook.addWorksheet('Data'
                                    , {
                                        views: [{ state: "frozen", ySplit: 7 }],
                                    }
                                );
                                // add image to workbook by buffer
                                const filepath = 'cypher_logo';
                                // var imageId2 = workbook.addImage({
                                //     buffer: fs.readFileSync(`${filepath}.png`),
                                //     extension: 'png',
                                // });

                                // worksheet.addImage(0, 'A1:D6');
                                worksheet.getRow(1).hidden = true;
                                worksheet.mergeCells('C2:AH6');
                                // worksheet.mergeCells('C7:J11');
                                //worksheet.addImage(imageId2, 'A1:D6');
                                worksheet.getCell('A2').value = 'DIRECTION :';
                                worksheet.getCell('B2').value = direction.toUpperCase();
                                if(HsCode){
                                worksheet.getRow(3).getCell(1).value = 'HSCODE :';
                                worksheet.getRow(3).getCell(2).value = HsCode.toString();
                                } else {
                                    worksheet.getRow(3).hidden = true;
                                }
                                worksheet.getRow(4).getCell(1).value = 'FROM :';
                                worksheet.getRow(4).getCell(2).value = fromDate;
                                worksheet.getRow(5).getCell(1).value = 'TO :';
                                worksheet.getRow(5).getCell(2).value = toDate;
                                worksheet.getRow(6).getCell(1).value = 'TOTAL RECORDS :';
                                worksheet.getRow(6).getCell(2).value = result.rows.length;
                                // worksheet.getRow(6).style.border = 'None';
                                // worksheet.getRow(7).style.border = 'None';
                                worksheet.getCell('A2').style.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
                                worksheet.getCell('B2').style.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
                                worksheet.getCell('A3').style.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
                                worksheet.getCell('B3').style.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
                                worksheet.getCell('A4').style.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
                                worksheet.getCell('B4').style.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
                                worksheet.getCell('A5').style.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
                                worksheet.getCell('B5').style.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
                                worksheet.getCell('A6').style.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
                                worksheet.getCell('B6').style.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
                                // Set column headers
                                delete result.rows[0].RecordID;
                                const a = getheaderarray(result.rows[0]);
                                worksheet.getRow(7).values = a;
                                worksheet.columns = getDataHeaders(result.rows[0]);
                                worksheet.getRow(7).fill = {
                                    type: 'pattern',
                                    pattern: 'solid',
                                    fgColor: { argb: 'f6be00' }
                                }

                                worksheet.columns.forEach((col) => {
                                    col.alignment = { horizontal: 'left' }
                                    col.style.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
                                })

                                // Add autofilter on each column
                                worksheet.autoFilter = 'A7:AH7';
                                // worksheet.addRows(result.rows);
                                // result.rows.forEach((row) => {
                                //     worksheet.addRow(row).commit();
                                // });
                                for(var i =0; i< result.rows.length;i++){
                                    worksheet.addRow(result.rows[i]).commit();
                                }
                                //await workbook.xlsx.writeFile(`${filename}.xlsx`);
                                // Upload to s3
                                // const fileContent = await fs.readFileSync(`${filename}.xlsx`)
                                // fs.unlinkSync(`${filename}.xlsx`);
                                worksheet.commit();
                                workbook.commit();
                                const params = {
                                    Bucket: 'cypher-download-files',
                                    Key: `${filename}.xlsx`,
                                    Body: stream
                                }
                               // fs.unlinkSync(`${filename}.xlsx`);
                                var options = {partSize: 5 * 1024 * 1024, queueSize: 4};
                                await s3.upload(params, async (err, data) => {
                                    if (err) {
                                        reject(err)
                                    }
                                    const dat = data.Expiration.match('"([^"]+)GMT"');
                                    const expirydate = utility.formatDate(new Date(dat[1]));
                                    // resolve(data.Location)
                                    db.query(query.update_download_count, [totalpointtodeduct, isSubUser ? parentuserid : UserId], (err, result) => {

                                    });
                                    db.query(query.add_download_workspace, [CountryCode, isSubUser ? subUserId : UserId, direction.toUpperCase(), recordIds, filename, datetime, data.Location, 'Completed', '',expirydate], async (err, result) => {
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

async function calllongquery(finalquery, UserId, CountryCode, direction, filename, datetime, id, fromDate, toDate, HsCode) {
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
                                //const workbook = new ExcelJs.Workbook();
                                const stream = new Stream.PassThrough();
                                const workbook = new ExcelJs.stream.xlsx.WorkbookWriter({
                                    stream: stream,
                                    useStyles: true,
                                    useSharedStrings: true,
                                });
                                // workbook.media.push({
                                //     filename: './cypher_logo.png',
                                //     extension: 'png',
                                //   })
                                // Define worksheet
                                const worksheet = workbook.addWorksheet('Data'
                                    , {
                                        views: [{ state: "frozen", ySplit: 7 }],
                                    }
                                );
                                // add image to workbook by buffer
                                const filepath = 'cypher_logo';
                                // var imageId2 = workbook.addImage({
                                //     buffer: fs.readFileSync(`${filepath}.png`),
                                //     extension: 'png',
                                // });

                                // worksheet.addImage(0, 'A1:D6');
                                worksheet.getRow(1).hidden = true;
                                worksheet.mergeCells('C2:AH6');
                                // worksheet.mergeCells('C7:J11');
                                //worksheet.addImage(imageId2, 'A1:D6');
                                worksheet.getCell('A2').value = 'DIRECTION :';
                                worksheet.getCell('B2').value = direction.toUpperCase();
                                if(HsCode){
                                worksheet.getRow(3).getCell(1).value = 'HSCODE :';
                                worksheet.getRow(3).getCell(2).value = HsCode.toString();
                                } else {
                                    worksheet.getRow(3).hidden = true;
                                }
                                worksheet.getRow(4).getCell(1).value = 'FROM :';
                                worksheet.getRow(4).getCell(2).value = fromDate;
                                worksheet.getRow(5).getCell(1).value = 'TO :';
                                worksheet.getRow(5).getCell(2).value = toDate;
                                worksheet.getRow(6).getCell(1).value = 'TOTAL RECORDS :';
                                worksheet.getRow(6).getCell(2).value = result.rows.length;
                                // worksheet.getRow(6).style.border = 'None';
                                // worksheet.getRow(7).style.border = 'None';
                                worksheet.getCell('A2').style.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
                                worksheet.getCell('B2').style.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
                                worksheet.getCell('A3').style.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
                                worksheet.getCell('B3').style.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
                                worksheet.getCell('A4').style.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
                                worksheet.getCell('B4').style.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
                                worksheet.getCell('A5').style.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
                                worksheet.getCell('B5').style.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
                                worksheet.getCell('A6').style.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
                                worksheet.getCell('B6').style.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
                                // Set column headers
                                delete result.rows[0].RecordID;
                                const a = getheaderarray(result.rows[0]);
                                worksheet.getRow(7).values = a;
                                worksheet.columns = getDataHeaders(result.rows[0]);
                                worksheet.getRow(7).fill = {
                                    type: 'pattern',
                                    pattern: 'solid',
                                    fgColor: { argb: 'f6be00' }
                                }

                                worksheet.columns.forEach((col) => {
                                    col.alignment = { horizontal: 'left' }
                                    col.style.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
                                })

                                // Add autofilter on each column
                                worksheet.autoFilter = 'A7:AH7';
                                // worksheet.addRows(result.rows);
                                // result.rows.forEach((row) => {
                                //     worksheet.addRow(row).commit();
                                // });
                                for(var i =0; i< result.rows.length;i++){
                                    worksheet.addRow(result.rows[i]).commit();
                                }
                                //await workbook.xlsx.writeFile(`${filename}.xlsx`);
                                // Upload to s3
                                // const fileContent = await fs.readFileSync(`${filename}.xlsx`)
                                // fs.unlinkSync(`${filename}.xlsx`);
                                worksheet.commit();
                                workbook.commit();
                                const params = {
                                    Bucket: 'cypher-download-files',
                                    Key: `${filename}.xlsx`,
                                    Body: stream
                                }
                               // fs.unlinkSync(`${filename}.xlsx`);
                                var options = {partSize: 5 * 1024 * 1024, queueSize: 4};
                                await s3.upload(params,options, async (err, data) => {
                                    console.log('line 562', err);
                                    
                                    if (err) {
                                        reject(err)
                                    }
                                    db.query(query.get_Name_by_userid,[UserId],(errs,result) =>{
                                        mail.sendSESEmail(result.rows[0].Email,template.replace("{{name}}",result.rows[0].FullName).replace("{{url}}",data.Location),config.downloadSubject, config.downloadsourceemail);
                                    })
                                    const dat = data.Expiration.match('"([^"]+)GMT"');
                                    const expirydate = utility.formatDate(new Date(dat[1]));
                                    // resolve(data.Location)
                                    db.query(query.update_download_count, [totalpointtodeduct, UserId], (err, result) => {

                                    });
                                    db.query(query.update_download_workspace, [recordIds, data.Location, 'Completed', '',expirydate, id], async (err, result) => {
                                        
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

function getheaderarray(row) {
    let columns = [];
    for (const prop in row) {
        columns.push(prop)
    }
    return columns;
}

function getDataHeaders(row) {
    let columns = [];
    for (const prop in row) {
        let calculatedwidth = 12;
        if (prop == 'ITEM DESCRIPTION') {
            calculatedwidth = 125;
        } else if (prop == 'VENDOR') {
            calculatedwidth = 40;
        } else if (prop == 'BUYER') {
            calculatedwidth = 50;
        } else if (prop == 'BUYER ADDRESS') {
            calculatedwidth = 100;
        } else {
            calculatedwidth = prop.length < 12 ? 14 : prop.length + 15
        }
        columns.push({
            header: prop,
            key: prop,
            width: calculatedwidth
        });
    }
    return columns;
}