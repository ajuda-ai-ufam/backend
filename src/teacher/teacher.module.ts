import { Module } from '@nestjs/common';
import { TeacherService } from './teacher.service';
import { PrismaService } from 'src/database/prisma.service';
import { TeacherController } from './teacher.controller';
import { SubjectService } from 'src/subject/subject.service';
import { ListTeacherSubjectsCommand } from './commands/list-teacher-subjects.command';
import { AssignSubjectCommand } from './commands/assign-subject.command';
import { SubjectModule } from 'src/subject/subject.module';
import { EmailModule } from 'src/email/email.module';
import { EmailService } from 'src/email/email.service';

@Module({
  providers: [
    TeacherService,
    PrismaService,
    SubjectService,
    EmailService,
    ListTeacherSubjectsCommand,
    AssignSubjectCommand,
  ],
  exports: [TeacherService],
  imports: [SubjectModule, EmailModule],
  controllers: [TeacherController],
})
export class TeacherModule {}
