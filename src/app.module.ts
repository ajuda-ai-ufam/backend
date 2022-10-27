import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { CourseModule } from './course/course.module';
import { PrismaService } from './database/prisma.service';
import { UserModule } from './user/user.module';
import { StudentModule } from './student/student.module';
import { GenerateCodeModule } from './generate-code/generate-code.module';
import { TypeUserModule } from './type_user/type_user.module';
import { TeacherModule } from './teacher/teacher.module';

@Module({
  imports: [AuthModule, CourseModule, UserModule, StudentModule, GenerateCodeModule, TypeUserModule, TeacherModule],
  controllers: [AppController],
  providers: [AppService, PrismaService],
})
export class AppModule {}
