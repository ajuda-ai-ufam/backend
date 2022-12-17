import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
@Injectable()
export class EmailService {
  constructor(private mailerService: MailerService) {}

  async sendEmailM(email: string, subject: string, message: string) {
    return this.mailerService.sendMail({
      to: email,
      from: process.env.MAIL_AUTH_USER,
      subject: subject,
      text: message,
      context: {
        code: message,
      },
    });
  }

  async sendEmail(
    email: string,
    subject: string,
    message: string,
    template: string,
  ) {
    return this.mailerService.sendMail({
      to: email,
      from: process.env.MAIL_AUTH_USER,
      subject: subject,
      text: message,
      template: `${template}.hbs`,
      context: {
        code: message,
      },
    });
  }
}
