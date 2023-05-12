import { Module } from '@nestjs/common';
import { CourseService } from 'src/course/course.service';
import { StudentModule } from 'src/student/student.module';
import { SubjectService } from 'src/subject/subject.service';
import { TeacherService } from 'src/teacher/teacher.service';
import { PrismaService } from '../database/prisma.service';
import { UserController } from './user.controller';
import { UserService } from './user.service';

@Module({
  controllers: [UserController],
  providers: [
    UserService,
    TeacherService,
    PrismaService,
    CourseService,
    SubjectService,
  ],
  imports: [StudentModule],
  exports: [UserService],
})
export class UserModule {}
