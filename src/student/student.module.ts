import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PrismaService } from 'src/database/prisma.service';
import { CreateStudentCommand } from './commands/create-student.command';
import { FindEnrollmentCommand } from './commands/find-enrollment.command';
import { FindOneByIdCommand } from './commands/find-one-by-id.command';
import { GetMonitorAvailabilityCommand } from './commands/get-monitor-availability.command';
import { ListStudentSchedulesCommand } from './commands/list-student-schedules.command';
import { ScheduleMonitoringCommand } from './commands/schedule-monitoring.command';
import { StudentController } from './student.controller';
import { EmailService } from 'src/email/email.service';
import { FindAllStudentsCommand } from './commands/find-all-students.command';

@Module({
  imports: [JwtModule],
  controllers: [StudentController],
  providers: [
    CreateStudentCommand,
    FindEnrollmentCommand,
    FindOneByIdCommand,
    FindAllStudentsCommand,
    GetMonitorAvailabilityCommand,
    ListStudentSchedulesCommand,
    ScheduleMonitoringCommand,
    PrismaService,
    EmailService,
  ],
  exports: [CreateStudentCommand, FindEnrollmentCommand],
})
export class StudentModule {}
