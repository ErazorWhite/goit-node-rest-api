import nodemailer from "nodemailer";
import pug from "pug";
import { convert } from "html-to-text";
import path from "path";

export class EmailService {
  constructor(user, url) {
    this.to = user.email;
    this.name = user.name;
    this.url = url;
    this.from = process.env.EMAIL_FROM;
  }

  #initTransport() {
    const emailTransportConfig =
      process.env.NODE_ENV === "production"
        ? {
            // MAILGUN
            host: process.env.MAILTRAP_HOST,
            port: +process.env.MAILTRAP_PORT,
            auth: {
              user: process.env.MAILTRAP_USER,
              pass: process.env.MAILTRAP_PASS,
            },
          }
        : {
            // MAILTRAP
            host: process.env.MAILTRAP_HOST,
            port: +process.env.MAILTRAP_PORT,
            auth: {
              user: process.env.MAILTRAP_USER,
              pass: process.env.MAILTRAP_PASS,
            },
          };
    return nodemailer.createTransport(emailTransportConfig);
  }

  async #send(template, subject, content) {
    const html = pug.renderFile(
      path.join(process.cwd(), "view", "email", `${template}.pug`),
      content
    );

    const emailConfig = {
      from: this.from,
      to: this.to,
      subject,
      html,
      text: convert(html),
    };

    await this.#initTransport().sendMail(emailConfig);
  }

  async sendHello() {
    await this.#send("hello", "Welcome email");
  }

  async passwordReset() {
    await this.#send("passwordReset", "Password reset instructions");
  }

  async sendVerificationEmail(verificationURL) {
    await this.#send("verification", `Please verify your email`, {
      verificationURL,
    });
  }
}
