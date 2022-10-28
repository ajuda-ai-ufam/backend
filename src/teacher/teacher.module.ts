import { Module } from '@nestjs/common';
import { TeacherService } from './teacher.service';
import { PrismaService } from 'src/database/prisma.service';

@Module({
  providers: [TeacherService,PrismaService],
  exports: [TeacherService]
})
export class TeacherModule {}
