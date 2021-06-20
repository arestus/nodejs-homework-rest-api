const Mailgen = require("mailgen");
require("dotenv").config();

class EmailService {
  constructor(env, sender) {
    this.sender = sender;
    switch (env) {
      case "development":
        this.link = "https://731bcc240d75.ngrok.io";
        break;
      case "production":
        this.link = "link for production";
        break;
      default:
        this.link = "https://731bcc240d75.ngrok.io";
        break;
    }
  }
  #createTemplateVerificationEmail(verifyToken, name) {
    const mailGenerator = new Mailgen({
      theme: "cerberus",
      product: {
        name: "GoIt course",
        link: this.link,
      },
    });
    const email = {
      body: {
        name,
        intro: "Welcome!",
        action: {
          instructions: "To get started with please click here:",
          button: {
            color: "#22BC66", // Optional action button color
            text: "Confirm your account",
            link: `${this.link}/api/users/verify/${verifyToken}`,
          },
        },
      },
    };
    return mailGenerator.generate(email);
  }
  async sendVerifyEmail(verifyToken, email, name) {
    const emailHtml = this.#createTemplateVerificationEmail(verifyToken, name);
    const msg = {
      to: email,
      subject: "Verify your account",
      html: emailHtml,
    };
    const result = await this.sender.send(msg);
    console.log(result);
  }
}
module.exports = EmailService;
