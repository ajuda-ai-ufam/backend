import { Module } from '@nestjs/common';
import { GenerateCodeService } from './generate-code.service';
import { GenerateCodeController } from './generate-code.controller';
import { UserService } from 'src/user/user.service';
import { PrismaService } from 'src/database/prisma.service';
import { CourseService } from 'src/course/course.service';
import { StudentService } from 'src/student/student.service';
import { TeacherService } from 'src/teacher/teacher.service';
import { EmailService } from 'src/email/email.service';
import { SubjectService } from 'src/subject/subject.service';

@Module({
  controllers: [GenerateCodeController],
  providers: [
    GenerateCodeService,
    TeacherService,
    UserService,
    CourseService,
    StudentService,
    PrismaService,
    EmailService,
    SubjectService,
  ],
})
export class GenerateCodeModule {}
