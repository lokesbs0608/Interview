const nodemailer = require("nodemailer");


const Transporter = nodemailer.createTransport({


    service: 'gmail',
    auth: {
        user: "lokeshbs0608@gmail.com",
        pass: "ygwp ngcp hojm wvwt"
    }
});
module.exports = Transporter