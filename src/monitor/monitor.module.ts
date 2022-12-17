import { Module } from '@nestjs/common';
import { MonitorService } from './monitor.service';
import { MonitorController } from './monitor.controller';
import { PrismaService } from 'src/database/prisma.service';
import { SubjectService } from 'src/subject/subject.service';
import { UserService } from 'src/user/user.service';
import { CourseService } from 'src/course/course.service';
import { StudentService } from 'src/student/student.service';
import { TeacherService } from 'src/teacher/teacher.service';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from 'src/auth/strategies/jwt.strategy';

@Module({
  controllers: [MonitorController],
  imports: [JwtModule],
  providers: [
    MonitorService,
    PrismaService,
    SubjectService,
    UserService,
    CourseService,
    StudentService,
    TeacherService,
    JwtStrategy,
  ],
})
export class MonitorModule {}
