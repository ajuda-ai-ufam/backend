import { Module } from '@nestjs/common';
import { GenerateCodeService } from './generate-code.service';
import { GenerateCodeController } from './generate-code.controller';
import { UserService } from 'src/user/user.service';
import { PrismaService } from 'src/database/prisma.service';
import { CourseService } from 'src/course/course.service';
import { StudentService } from 'src/student/student.service';

@Module({
  controllers: [GenerateCodeController],
  providers: [GenerateCodeService,UserService,CourseService,StudentService,PrismaService]
})
export class GenerateCodeModule {}
