import { Module } from '@nestjs/common';
import { TeacherService } from './teacher.service';
import { TeacherController } from './teacher.controller';
import { PrismaService } from 'src/database/prisma.service';

@Module({
  controllers: [TeacherController],
  providers: [TeacherService,PrismaService],
  exports: [TeacherService]
})
export class TeacherModule {}
