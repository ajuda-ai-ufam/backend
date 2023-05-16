import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
@Injectable()
export class EmailService {
  constructor(private mailerService: MailerService) {}

  async sendEmailRequestMonitoring(
    email: string,
    subject: string,
    message,
    template: string,
  ) {
    return this.mailerService.sendMail({
      to: email,
      from: process.env.MAIL_AUTH_USER,
      subject: subject,
      text: subject,
      template: `${template}.hbs`,
      context: {
        student_name: message.student_name,
        subject_name: message.subject_name,
        front_end_base_url: process.env.FRONT_END_BASE_URL,
      },
    });
  }

  async sendEmailAcceptMonitoring(
    email: string,
    subject: string,
    template: string,
  ) {
    return this.mailerService.sendMail({
      to: email,
      from: process.env.MAIL_AUTH_USER,
      subject: subject,
      text: subject,
      template: `${template}.hbs`,
      context: {
        front_end_base_url: process.env.FRONT_END_BASE_URL,
      },
    });
  }

  async sendEmailRefuseMonitoring(
    email: string,
    subject: string,
    template: string,
  ) {
    return this.mailerService.sendMail({
      to: email,
      from: process.env.MAIL_AUTH_USER,
      subject: subject,
      text: subject,
      template: `${template}.hbs`,
      context: {
        front_end_base_url: process.env.FRONT_END_BASE_URL,
      },
    });
  }

  async sendEmailRefuseScheduledMonitoring(
    email: string,
    subject: string,
    template: string,
  ) {
    return this.mailerService.sendMail({
      to: email,
      from: process.env.MAIL_AUTH_USER,
      subject: subject,
      text: subject,
      template: `${template}.hbs`,
      context: {
        front_end_base_url: process.env.FRONT_END_BASE_URL,
      },
    });
  }

  async sendEmailCancelMonitoring(
    email: string,
    subject: string,
    context: any,
    template: string,
  ) {
    return this.mailerService.sendMail({
      to: email,
      from: process.env.MAIL_AUTH_USER,
      subject: subject,
      text: subject,
      template: `${template}.hbs`,
      context,
    });
  }

  async sendEmailScheduleMonitoring(
    email: string,
    subject: string,
    context: any,
    template: string,
  ) {
    return this.mailerService.sendMail({
      to: email,
      from: process.env.MAIL_AUTH_USER,
      subject: subject,
      text: subject,
      template: `${template}.hbs`,
      context: {
        ...context,
        front_end_base_url: process.env.FRONT_END_BASE_URL,
      },
    });
  }

  async sendEmail(
    email: string,
    subject: string,
    context: string,
    template: string,
  ) {
    return this.mailerService.sendMail({
      to: email,
      from: process.env.MAIL_AUTH_USER,
      subject: subject,
      text: context,
      template: `${template}.hbs`,
      context: {
        code: context,
      },
    });
  }
}
