import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
@Injectable()
export class EmailService {
  constructor(private mailerService: MailerService) {}

  async sendEmailRequestMonitoring(
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
        student_name: context.student_name,
        subject_name: context.subject_name,
        front_end_base_url: process.env.FRONT_END_BASE_URL,
      },
    });
  }

  async sendEmailAssignSubject(
    email: string,
    teacher: string,
    subject: string,
    subject_id: number,
  ) {
    return this.mailerService.sendMail({
      to: email,
      from: process.env.MAIL_AUTH_USER,
      subject: 'Agora você é responsável!',
      text: 'Agora você é responsável!',
      template: `assign-subject.hbs`,
      context: {
        front_end_base_url: process.env.FRONT_END_BASE_URL,
        teacher,
        subject,
        subject_id,
      },
    });
  }

  async sendEmailAcceptMonitoring(
    email: string,
    subject: string,
    template: string,
    subjectId: number,
  ) {
    return this.mailerService.sendMail({
      to: email,
      from: process.env.MAIL_AUTH_USER,
      subject: subject,
      text: subject,
      template: `${template}.hbs`,
      context: {
        front_end_base_url: process.env.FRONT_END_BASE_URL,
        subjectId: subjectId,
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

  async sendEmailRefuseScheduledMonitoring(
    email: string,
    status: string,
    name: string,
    date: string,
    start: string,
    end: string,
    preferential_place: string,
  ) {
    return this.mailerService.sendMail({
      to: email,
      from: process.env.MAIL_AUTH_USER,
      subject: 'Nós sentimos muito...',
      text: 'Nós sentimos muito...',
      template: 'refused_scheduled_monitoring.hbs',
      context: {
        status,
        name,
        date,
        start,
        end,
        preferential_place,
        front_end_base_url: process.env.FRONT_END_BASE_URL,
      },
    });
  }

  async sendAcceptedScheduleEmail(
    email: string,
    status: string,
    name: string,
    date: string,
    start: string,
    end: string,
    preferential_place: string,
  ) {
    return this.mailerService.sendMail({
      to: email,
      from: process.env.MAIL_AUTH_USER,
      subject: 'A ajuda está vindo!',
      text: 'A ajuda está vindo!',
      template: 'accepted_scheduled_monitoring.hbs',
      context: {
        status,
        name,
        date,
        start,
        end,
        preferential_place,
        front_end_base_url: process.env.FRONT_END_BASE_URL,
      },
    });
  }

  async sendEmailResetPassword(email: string, token: string) {
    return this.mailerService.sendMail({
      to: email,
      from: process.env.MAIL_AUTH_USER,
      subject: 'Recuperação de senha',
      text: 'Recuperação de senha',
      template: `email_reset_password_token.hbs`,
      context: {
        token,
        frontEndBaseUrl: process.env.FRONT_END_BASE_URL,
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
