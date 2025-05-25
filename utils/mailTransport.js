// utils/mailTransport.js
const nodemailer = require('nodemailer');

module.exports = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    // your Gmail address
    user: process.env.GMAIL_USER,      
    // your app password (not your regular Gmail password)
    pass: process.env.GMAIL_APP_PASS  
  }
});
