import { Module } from '@nestjs/common';
import { TeacherService } from './teacher.service';
import { PrismaService } from 'src/database/prisma.service';
import { TeacherController } from './teacher.controller';
import { SubjectService } from 'src/subject/subject.service';

@Module({
  providers: [TeacherService, PrismaService, SubjectService],
  exports: [TeacherService],
  controllers: [TeacherController],
})
export class TeacherModule {}
