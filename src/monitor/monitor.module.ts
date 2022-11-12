import { Module } from '@nestjs/common';
import { MonitorService } from './monitor.service';
import { MonitorController } from './monitor.controller';
import { PrismaService } from 'src/database/prisma.service';
import { SubjectService } from 'src/subject/subject.service';
import { UserService } from 'src/user/user.service';
import { CourseService } from 'src/course/course.service';
import { StudentService } from 'src/student/student.service';
import { TeacherService } from 'src/teacher/teacher.service';

@Module({
  controllers: [MonitorController],
  providers: [
    MonitorService,
    PrismaService,
    SubjectService,
    UserService,
    CourseService,
    StudentService,
    TeacherService,
  ],
})
export class MonitorModule {}
