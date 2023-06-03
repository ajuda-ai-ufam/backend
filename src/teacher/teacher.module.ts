import { Module } from '@nestjs/common';
import { TeacherService } from './teacher.service';
import { PrismaService } from 'src/database/prisma.service';
import { TeacherController } from './teacher.controller';
import { SubjectService } from 'src/subject/subject.service';
import { ListTeacherSubjectsCommand } from './commands/list-teacher-subjects.command';
import { AssignSubjectCommand } from './commands/assign-subject.command';

@Module({
  providers: [
    TeacherService,
    PrismaService,
    SubjectService,
    ListTeacherSubjectsCommand,
    AssignSubjectCommand,
  ],
  exports: [TeacherService],
  controllers: [TeacherController],
})
export class TeacherModule {}
