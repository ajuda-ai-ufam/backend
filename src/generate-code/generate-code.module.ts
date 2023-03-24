import { Module } from '@nestjs/common';
import { GenerateCodeService } from './generate-code.service';
import { GenerateCodeController } from './generate-code.controller';
import { UserService } from 'src/user/user.service';
import { PrismaService } from 'src/database/prisma.service';
import { CourseService } from 'src/course/course.service';
import { TeacherService } from 'src/teacher/teacher.service';
import { EmailService } from 'src/email/email.service';
import { SubjectService } from 'src/subject/subject.service';
import { StudentModule } from 'src/student/student.module';
import { UserModule } from 'src/user/user.module';

@Module({
  controllers: [GenerateCodeController],
  providers: [
    GenerateCodeService,
    TeacherService,
    UserService,
    CourseService,
    PrismaService,
    EmailService,
    SubjectService,
  ],
  imports: [
    StudentModule,
    UserModule,
  ],
})
export class GenerateCodeModule {}
