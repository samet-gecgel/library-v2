const nodemailer = require("nodemailer");
const config = require("../config");

var tranporter = nodemailer.createTransport({
    host: "smtp-mail.outlook.com",
    // service : 'gmail',
    secure : false,
    port: 587,
    tls: {
        rejectUnauthorized : true
    },
    auth: {
        user: config.email.username,
        pass: config.email.password
    }
});

module.exports = tranporter;

