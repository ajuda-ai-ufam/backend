import { EmailModule } from './../email/email.module';
import { Module } from '@nestjs/common';
import { MonitorService } from './monitor.service';
import { MonitorController } from './monitor.controller';
import { PrismaService } from 'src/database/prisma.service';
import { SubjectService } from 'src/subject/subject.service';
import { UserService } from 'src/user/user.service';
import { CourseService } from 'src/course/course.service';
import { TeacherService } from 'src/teacher/teacher.service';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from 'src/auth/strategies/jwt.strategy';
import { StudentModule } from 'src/student/student.module';
import { UserModule } from 'src/user/user.module';
import { ListMonitorsCommand } from './commands/list-monitors.command';

@Module({
  controllers: [MonitorController],
  imports: [JwtModule, EmailModule, StudentModule, UserModule],
  providers: [
    MonitorService,
    PrismaService,
    SubjectService,
    UserService,
    CourseService,
    TeacherService,
    JwtStrategy,
    ListMonitorsCommand,
  ],
})
export class MonitorModule {}
