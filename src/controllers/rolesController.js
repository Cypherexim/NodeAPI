const db = require('../../src/utils/database');
const { success, error } = require('../../src/utils/response');
const query = require('../../src/sql/queries');

exports.getRoleList = async (req, res) => {
    try {
        db.query(query.get_all_roles, (err, result) => {
            return res.status(200).json(success("Ok", result.rows, res.statusCode));
        });
    } catch (err) {
        return res.status(500).json(error(err, res.statusCode));
    };
}

exports.getAccessByRoleId = async (req, res) => {
    try {
        const { Id } = req.query;
        db.query(query.getRoleswithAccess, [Id], (err, result) => {
            if(!err){
            return res.status(200).json(success("Ok", result.rows, res.statusCode));
            }
        });
    } catch (err) {
        return res.status(500).json(error(err, res.statusCode));
    };
}