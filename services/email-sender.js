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
    // const emailOptions = {
    //   from: "arestus@meta.ua",
    //   to: "arestus@gmail.com",
    //   subject: "Nodemailer test",
    //   text: "Привет. Мы тестируем отправку писем!",
    // };
    return await transporter
      .sendMail({ ...msg, from: process.env.EMAIL })
      .then((info) => console.log(info))
      .catch((err) => console.log(err));
  }
}

module.exports = CreateSenderNodemailer;
