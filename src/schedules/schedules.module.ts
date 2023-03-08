import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/database/prisma.service';
import { EndScheduleCommand } from './commands/end-schedule.command';
import { ListEndingSchedulesCommand } from './commands/list-ending-schedules.command';
import { ListSchedulesCommand } from './commands/list-schedules.command';
import { SchedulesController } from './schedules.controller';

@Module({
  providers: [
    EndScheduleCommand,
    ListSchedulesCommand,
    ListEndingSchedulesCommand,
    PrismaService,
    JwtService,
  ],
  exports: [],
  controllers: [SchedulesController],
})
export class SchedulesModule {}
