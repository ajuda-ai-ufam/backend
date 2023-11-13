import { Module } from '@nestjs/common';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/database/prisma.service';
import { CancelSubjectEnrollmentCommand } from './commands/cancel-subject-enrollment.command';
import { CreateSubjectEnrollmentCommand } from './commands/create-subject-enrollment.command';
import { EndResponsabilityCommand } from './commands/end-responsability-command';
import { SubjectController } from './subject.controller';
import { SubjectService } from './subject.service';

@Module({
  controllers: [SubjectController],
  imports: [JwtModule],
  providers: [
    SubjectService,
    EndResponsabilityCommand,
    CreateSubjectEnrollmentCommand,
    CancelSubjectEnrollmentCommand,
    PrismaService,
    JwtService,
  ],
  exports: [SubjectService],
})
export class SubjectModule {}
