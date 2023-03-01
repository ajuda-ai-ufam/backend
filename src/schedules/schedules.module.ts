import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/database/prisma.service';
import { ListSchedulesCommand } from './commands/list-schedules.command';
import { SchedulesController } from './schedules.controller';

@Module({
  providers: [ListSchedulesCommand, PrismaService, JwtService],
  exports: [],
  controllers: [SchedulesController],
})
export class SchedulesModule {}
