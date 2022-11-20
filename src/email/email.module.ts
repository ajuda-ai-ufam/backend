import { MailerModule } from '@nestjs-modules/mailer';
import { Module } from '@nestjs/common';
import { join } from 'path';
import { EmailService } from './email.service';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';

@Module({
  imports:[MailerModule],
  providers: [EmailService],
  exports: [EmailService]
})
export class EmailModule {}
