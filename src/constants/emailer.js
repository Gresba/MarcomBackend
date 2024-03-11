const nodemailer = require('nodemailer');

// Creating transporter to send emails using nodemailer
let transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        // Email Address
        user: process.env.MARKCOMEMAIL, 
        
        // Email App Password
        pass: process.env.MARKCOMPASS
    }
});

// Send email
async function sendEmail(to, subject, message)
{
    const options = {
        to: to,
        subject: subject,
        text: message,
    }

    transporter.sendMail(options, (error, success) => {
        if (error) {
            return console.log(error);
        }
        console.log('Message %s sent: %s', success.messageId, success.response);
    });
}

module.exports = {
    sendEmail
}