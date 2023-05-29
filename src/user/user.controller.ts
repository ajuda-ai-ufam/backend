import {
  BadRequestException,
  Body,
  Controller,
  ForbiddenException,
  Get,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Post,
  PreconditionFailedException,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { Request } from 'express';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiTags,
  ApiResponse,
} from '@nestjs/swagger';
import { IsPublic } from 'src/auth/decorators/is-public.decorator';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import {
  ExpiredCodeException,
  InvalidCodeException,
  InvalidPasswordException,
  InvalidTokenException,
  UsedCodeException,
  ValidResetPasswordTokenFoundException,
  UserNotFoundException,
  MissingFieldsException,
  ContactEmailAreadyExistsException,
  CourseNotFoundException,
  EmailAreadyExistsException,
  EnrollmentAlreadyExistsException,
  InvalidEmailException,
  InvalidEnrollmentException,
  InvalidLinkedinURLException,
  InvalidNameException,
  InvalidWhatsAppNumberException,
  PasswordsDoNotMatchException,
  PersonalDataInPasswordException,
  InvalidContactEmailException,
} from 'src/user/utils/exceptions';
import { ResetPasswordCommand } from './commands/reset-password.command';
import { ResetPasswordRequestBody } from './dto/reset-password.request.dto';
import { StudentCreateDTO } from './dto/student-create.dto';
import { TeacherCreateDTO } from './dto/teacher-create.dto';
import { GetUserInfoResponse } from './dto/user-info.response.dto';
import { UserService } from './user.service';
import { GetUserInfoCommand } from './commands/get-user-info.command';
import { JWTUser } from 'src/auth/interfaces/jwt-user.interface';
import { ResetPasswordTokenRequestBody } from './dto/reset-password-token.request.dto';
import { CreateResetPasswordTokenCommand } from './commands/create-reset-password-token.command';
import {} from 'src/user/utils/exceptions';
import { JwtService } from '@nestjs/jwt';

@Controller('user')
@ApiTags('User')
export class UserController {
  [x: string]: any;
  constructor(
    private readonly userService: UserService,
    private readonly createResetPasswordTokenCommand: CreateResetPasswordTokenCommand,
    private readonly resetPasswordCommand: ResetPasswordCommand,
    private readonly getUserInfo: GetUserInfoCommand,
    private readonly jwtService: JwtService,
  ) {}

  @ApiOperation({ description: 'Rota para criar usuário-estudante.' })
  @Post('student')
  @IsPublic()
  async createUserStudent(@Body() data: StudentCreateDTO) {
    try {
      return await this.userService.createUserStudent(data);
    } catch (error) {
      if (
        error instanceof MissingFieldsException ||
        error instanceof InvalidNameException ||
        error instanceof InvalidEmailException ||
        error instanceof EmailAreadyExistsException ||
        error instanceof ContactEmailAreadyExistsException ||
        error instanceof CourseNotFoundException ||
        error instanceof InvalidEnrollmentException ||
        error instanceof InvalidPasswordException ||
        error instanceof PersonalDataInPasswordException ||
        error instanceof PasswordsDoNotMatchException ||
        error instanceof InvalidLinkedinURLException ||
        error instanceof InvalidWhatsAppNumberException ||
        error instanceof EnrollmentAlreadyExistsException
      ) {
        throw new BadRequestException(error.message);
      }

      if (error instanceof CourseNotFoundException) {
        throw new NotFoundException(error.message);
      }

      throw error;
    }
  }

  @ApiOperation({ description: 'Rota para criar usuário-professor.' })
  @Post('teacher')
  @IsPublic()
  async createUserTeacher(@Body() data: TeacherCreateDTO) {
    try {
      return await this.userService.createUserTeacher(data);
    } catch (error) {
      if (
        error instanceof MissingFieldsException ||
        error instanceof InvalidNameException ||
        error instanceof InvalidEmailException ||
        error instanceof InvalidContactEmailException ||
        error instanceof EmailAreadyExistsException ||
        error instanceof InvalidPasswordException ||
        error instanceof PersonalDataInPasswordException ||
        error instanceof PasswordsDoNotMatchException
      ) {
        throw new BadRequestException(error.message);
      }

      if (error instanceof CourseNotFoundException) {
        throw new NotFoundException(error.message);
      }

      throw error;
    }
  }

  @ApiOperation({ description: 'Rota para listar todos os usuários.' })
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Get()
  async findOne(@Query('enrollment') enrollment: string) {
    return this.userService.findOneByEnrollment(enrollment);
  }

  @ApiOperation({ description: 'Rota para criar token de resetar a senha.' })
  @HttpCode(HttpStatus.NO_CONTENT)
  @Post('reset-password/token')
  async createResetPasswordToken(@Body() data: ResetPasswordTokenRequestBody) {
    try {
      return await this.createResetPasswordTokenCommand.execute(data.email);
    } catch (error) {
      if (error instanceof UserNotFoundException) {
        throw new NotFoundException(error.message);
      }

      if (error instanceof ValidResetPasswordTokenFoundException) {
        throw new PreconditionFailedException(error.message);
      }

      throw error;
    }
  }
  @ApiOperation({ description: 'Rota para resetar a senha.' })
  @HttpCode(HttpStatus.NO_CONTENT)
  @Post('reset-password')
  async resetPassword(@Body() data: ResetPasswordRequestBody) {
    try {
      return await this.resetPasswordCommand.execute(
        data.newPassword,
        data.token,
      );
    } catch (error) {
      if (
        error instanceof InvalidPasswordException ||
        error instanceof InvalidTokenException
      ) {
        throw new BadRequestException(error.message);
      }

      if (
        error instanceof ExpiredCodeException ||
        error instanceof InvalidCodeException ||
        error instanceof UsedCodeException
      ) {
        throw new ForbiddenException(error.message);
      }

      throw error;
    }
  }

  @ApiOperation({ description: 'Rota para retornar dados cadastrais' })
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Get('me')
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Dados cadastrais encontrados.',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Não foi encontrado um token de autenticação válido.',
  })
  async returnUserInfo(@Req() req: Request): Promise<GetUserInfoResponse> {
    const token = req.headers.authorization.toString().replace('Bearer ', '');
    const user = this.jwtService.decode(token) as JWTUser;
    return await this.getUserInfo.execute(user.sub);
  }
}
