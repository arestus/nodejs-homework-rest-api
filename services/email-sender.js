const sgMail = require("@sendgrid/mail");
const nodemailer = require("nodemailer");
require("dotenv").config();

class CreateSenderSendGrid {
  async send(msg) {
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);
    return await sgMail.send({ ...msg, from: "arestus@meta.ua" });
  }
}

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
    const transporter = nodemailer.createTransport(config);
    return await transporter
      .sendMail({ ...msg, from: process.env.EMAIL })
      .then((info) => console.log(info))
      .catch((err) => console.log("Error transporter line 19", err));
  }
}

// const smtpTransport = nodemailer.createTransport({
//   service: "Gmail",
//   auth: {
//     user: process.env.EMAIL,
//     pass: process.env.PASSWORD,
//   },
//   tls: {
//     rejectUnauthorized: false,
//   },
// });
// const mailOptions = {
//   from: "arestus@gmail.com",
//   to: "arestus2@gmail.com",
//   subject: "Welcome to ",
//   html: "<p>HTML version of the message</p>",
// };
// smtpTransport.sendMail(mailOptions, function (error, response) {
//   if (error) {
//     console.log(error);
//   } else {
//     console.log("mail sent");
//   }
// });

// module.exports = smtpTransport;

module.exports = { CreateSenderSendGrid, CreateSenderNodemailer };
