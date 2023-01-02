const { response } = require('express');
const db = require('../../src/utils/database');
const { validationResult } = require('express-validator');
const { success, error, validation } = require('../../src/utils/response');
const query = require('../../src/sql/queries');
const utility = require('../utils/utility');

exports.saveDownload = async(req, res) =>{
    try {
        const { countrycode, userId, direction, recordIds, workspacename } = req.body;

        const workspace = await db.query(query.check_download_workspancename, [workspacename]);
        if(workspace.rows.length == 0){
           // const check = await db.query('SELECT * FROM public.userplantransaction WHERE recordIds @>{"1","2","3"}');
            //if(check)
            db.query(query.add_download_workspace, [countrycode, userId, direction, recordIds, workspacename], (err, result) => {
                return res.status(201).json(success("Ok", result.command + " Successful.", res.statusCode));
            });
        } else {
            return res.status(200).json(error("workspace name already exists"));
        }
        
    } catch (err) {
        return res.status(500).json(error(err, res.statusCode));
    };
}

exports.getDownloadworkspace = async(req,res) =>{
    try {
        const { userId } = req.query;
            db.query(query.get_download_Workspace, [userId], (err, result) => {
                return res.status(200).json(success("Ok", result.rows, res.statusCode));
            });
    } catch (err) {
        return res.status(500).json(error(err, res.statusCode));
    };
}