import { MailerModule } from '@nestjs-modules/mailer';
import { Module } from '@nestjs/common';
import { join } from 'path';
import { EmailService } from './email.service';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';

@Module({
  imports:[MailerModule.forRoot({
      transport: {
        host: process.env.MAIL_HOST,
        secure: false,
        port: Number(process.env.MAIL_PORT),
        auth:{
          user: process.env.MAIL_AUTH_USER,
          pass: process.env.MAIL_AUTH_PASS,
        },
      },
      // template: {
      //   dir: join(__dirname + '/templates'),
      //   adapter: new HandlebarsAdapter(),
      //   options:{
      //     strict: true,
      //   }
      // },
    })
  ],
  providers: [EmailService],
  exports: [EmailService]
})
export class EmailModule {}
