const { response } = require('express');
const { validationResult } = require('express-validator');
const { success, error, validation } = require('../utils/response');
const fs = require('fs');
const AWS = require('aws-sdk');
// require('dotenv').config()
// import AWS from 'aws-sdk'
AWS.config.update({
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SK
    });
// const s3 = new AWS.s3({
//     accessKeyId: process.env.AWS_ACCESS_KEY_ID,
//     secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
// })
// initialize s3
const s3 = new AWS.S3();
exports.uploadFiletoS3 = async (req, res) => {
    try {
        const filename = 'the-file-name'
        const fileContent = fs.readFileSync('E:/projects/Cypher/EC2Detils.txt')

        const params = {
            Bucket: process.env.AWS_BUCKET_NAME,
            Key: `${filename}.txt`,
            Body: fileContent
        }

        s3.upload(params, (err, data) => {
            if (err) {
                reject(err)
            }
            // resolve(data.Location)
           
            return res.status(200).json(success("Ok", data, res.statusCode));
        })
    } catch (err) {
        return res.status(500).json(error(err, res.statusCode));
    };
}