var nodemailer = require('nodemailer');
const AWS = require("aws-sdk");
AWS.config.update({region:'us-east-1'});
const SES = new AWS.SES({ apiVersion: '2010-12-01' });
const config = require('../utils/config');

exports.SendEmail = async (toEmail, Subject, Message) => {
    var transporter = nodemailer.createTransport({
        //service: 'gmail',
        host: 'mail.myeximpanel.com',
        port: 465,
        secure: true,
        auth: {
            user: config.fromEmail,
            pass: config.fromPassword
        }
    });

    var mailOptions = {
        from: config.fromEmail,
        to: toEmail,
        subject: Subject,
        text: Message,
        bcc: config.fromEmail
    };

    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });
}

exports.sendSESEmail = async (email, data) => {
    // SES params to be sent
    const sesParams = {
        Destination: {
            ToAddresses: [email],
        },
        Message: {
            Body: {
                Html: {
                    Data: data.template,
                    Charset: 'UTF-8'
                }
            },
            Subject: {
                Data: 'Test Email',
            }
        },
        Source: 'Cypher<dispatch@cypherexim.com>'
    };

    // Send mail
    return await SES.sendEmail(sesParams).promise();
};