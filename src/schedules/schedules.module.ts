import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/database/prisma.service';
import { EmailService } from 'src/email/email.service';
import { CancelScheduleCommand } from './commands/cancel-schedule.command';
import { EndScheduleCommand } from './commands/end-schedule.command';
import { ListEndingSchedulesCommand } from './commands/list-ending-schedules.command';
import { ListSchedulesCommand } from './commands/list-schedules.command';
import { SchedulesController } from './schedules.controller';
import { CreateTopicCommand } from './commands/create-topic.command';

@Module({
  providers: [
    CancelScheduleCommand,
    EndScheduleCommand,
    ListSchedulesCommand,
    ListEndingSchedulesCommand,
    CreateTopicCommand,
    JwtService,
    EmailService,
    PrismaService,
  ],
  exports: [],
  controllers: [SchedulesController],
})
export class SchedulesModule {}
