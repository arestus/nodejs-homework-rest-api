const nodemailer = require("nodemailer");
require("dotenv").config();

class CreateSenderNodemailer {
  async send(msg) {
    const config = {
      host: "smtp.meta.ua",
      port: 465,
      secure: true, // true for 465, false for other ports
      auth: {
        user: process.env.EMAIL, // generated ethereal user
        pass: process.env.PASSWORD, // generated ethereal password
      },
    };
    let transporter = nodemailer.createTransport(config);
    return await transporter.sendMail({ ...msg, from: process.env.EMAIL });
  }
}

module.exports = CreateSenderNodemailer;
