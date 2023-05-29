import { Module } from '@nestjs/common';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from 'src/auth/strategies/jwt.strategy';
import { CourseService } from 'src/course/course.service';
import { EmailModule } from 'src/email/email.module';
import { EmailService } from 'src/email/email.service';
import { StudentModule } from 'src/student/student.module';
import { SubjectService } from 'src/subject/subject.service';
import { TeacherService } from 'src/teacher/teacher.service';
import { PrismaService } from '../database/prisma.service';
import { CreateResetPasswordTokenCommand } from './commands/create-reset-password-token.command';
import { GetUserInfoCommand } from './commands/get-user-info.command';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { ResetPasswordCommand } from './commands/reset-password.command';
import { EditUserCommand } from './commands/edit-user.command';

@Module({
  controllers: [UserController],
  providers: [
    UserService,
    TeacherService,
    PrismaService,
    CourseService,
    SubjectService,
    EmailService,
    JwtService,
    CreateResetPasswordTokenCommand,
    ResetPasswordCommand,
    GetUserInfoCommand,
    EditUserCommand,
    JwtStrategy,
  ],
  imports: [
    StudentModule,
    JwtModule.register({ secret: process.env.SECRET_KEY }),
    EmailModule,
    PassportModule,
  ],
  exports: [UserService],
})
export class UserModule {}
