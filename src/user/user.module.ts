import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { PrismaService } from '../database/prisma.service';
import { StudentService } from 'src/student/student.service';
import { CourseService } from 'src/course/course.service';

@Module({
  controllers: [UserController],
  providers: [UserService, PrismaService,StudentService,CourseService],
  exports: [UserService],
})
export class UserModule {}
