import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { EmailDTO } from './dto/email.dto';

@Injectable()
export class EmailService {

    constructor(private mailerService: MailerService){}

    async sendEmail(email: string,subject:string,message:string) {
        return this.mailerService.sendMail({
          to: email,
          from: process.env.MAIL_AUTH_USER,
          subject: subject,
          text: message,
          context: {
            message
          },
        });
    }

}
