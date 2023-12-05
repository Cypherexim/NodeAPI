const { success, error } = require('../utils/response');
const fs = require('fs');
const AWS = require('aws-sdk');
// require('dotenv').config()
// import AWS from 'aws-sdk'
AWS.config.update({
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: 'Wdj+25O1ZMzkAl1P6a59meMFoq97BAjCnWAWfdHT'
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
        const fileContent = fs.readFileSync('G:/projects/Cypher/deploy.txt')

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