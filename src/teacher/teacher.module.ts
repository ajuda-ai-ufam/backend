import { Module } from '@nestjs/common';
import { TeacherService } from './teacher.service';
import { PrismaService } from 'src/database/prisma.service';
import { TeacherController } from './teacher.controller';
import { SubjectService } from 'src/subject/subject.service';
import { ListTeacherSubjectsCommand } from './commands/list-teacher-subjects.command';

@Module({
  providers: [
    TeacherService,
    PrismaService,
    SubjectService,
    ListTeacherSubjectsCommand,
  ],
  exports: [TeacherService],
  controllers: [TeacherController],
})
export class TeacherModule {}
