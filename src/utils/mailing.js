var nodemailer = require('nodemailer');
const config = require('../utils/config');

exports.SendEmail = async (toEmail, Subject, Message) => {
    var transporter = nodemailer.createTransport({
        //service: 'gmail',
        host:'mail.myeximpanel.com',
        port:465,
        secure:true,
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