import { Module } from '@nestjs/common';
import { StudentController } from './student.controller';
import { PrismaService } from 'src/database/prisma.service';
import { JwtModule } from '@nestjs/jwt';
import { ListStudentSchedulesCommand } from './commands/list-student-schedules.command';
import { CreateStudentCommand } from './commands/create-student.command';
import { FindEnrollmentCommand } from './commands/find-enrollment.command';
import { FindOneByIdCommand } from './commands/find-one-by-id.command';
import { ScheduleMonitoringCommand } from './commands/schedule-monitoring.command';
import { GetMonitorAvailabilityCommand } from './commands/get-monitor-availability.command';

@Module({
  imports: [JwtModule],
  controllers: [StudentController],
  providers: [
    CreateStudentCommand,
    FindEnrollmentCommand,
    FindOneByIdCommand,
    GetMonitorAvailabilityCommand,
    ListStudentSchedulesCommand,
    ScheduleMonitoringCommand,
    PrismaService,
  ],
  exports: [
    CreateStudentCommand,
    FindEnrollmentCommand,
  ],
})
export class StudentModule {}
