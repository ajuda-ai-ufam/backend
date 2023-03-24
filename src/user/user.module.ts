import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { PrismaService } from '../database/prisma.service';
import { CourseService } from 'src/course/course.service';
import { TeacherService } from 'src/teacher/teacher.service';
import { SubjectService } from 'src/subject/subject.service';
import { CreateStudentCommand } from 'src/student/commands/create-student.command';
import { FindEnrollmentCommand } from 'src/student/commands/find-enrollment.command';
import { StudentModule } from 'src/student/student.module';

@Module({
  controllers: [UserController],
  providers: [
    UserService,
    TeacherService,
    PrismaService,
    CourseService,
    SubjectService,
  ],
  imports: [
    StudentModule,
  ],
  exports: [UserService],
})
export class UserModule {}
