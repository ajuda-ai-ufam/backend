import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { SubjectService } from './subject.service';
import { SubjectController } from './subject.controller';
import { PrismaService } from 'src/database/prisma.service';
import { EndResponsabilityCommand } from './commands/end-responsability-command';

@Module({
  controllers: [SubjectController],
  providers: [SubjectService, EndResponsabilityCommand, PrismaService],
  imports: [JwtModule],
  exports: [SubjectService],
})
export class SubjectModule {}
