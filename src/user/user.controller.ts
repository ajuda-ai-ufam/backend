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
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { IsPublic } from 'src/auth/decorators/is-public.decorator';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import {
  ExpiredCodeException,
  InvalidCodeException,
  InvalidPasswordException,
  InvalidTokenException,
  UsedCodeException,
  UserNotFoundException,
  ValidResetPasswordTokenFoundException,
} from 'src/user/utils/exceptions';
import { CreateResetPasswordTokenCommand } from './commands/create-reset-password-token.command';
import { ResetPasswordCommand } from './commands/reset-password.command';
import { ResetPasswordTokenRequestBody } from './dto/reset-password-token.request.dto';
import { ResetPasswordRequestBody } from './dto/reset-password.request.dto';
import { StudentCreateDTO } from './dto/student-create.dto';
import { TeacherCreateDTO } from './dto/teacher-create.dto';
import { UserService } from './user.service';

@Controller('user')
@ApiTags('User')
export class UserController {
  [x: string]: any;
  constructor(
    private readonly userService: UserService,
    private readonly createResetPasswordTokenCommand: CreateResetPasswordTokenCommand,
    private readonly resetPasswordCommand: ResetPasswordCommand,
  ) {}

  @ApiOperation({ description: 'Rota para criar usuário-estudante.' })
  @Post('student')
  @IsPublic()
  async createUserStudent(@Body() data: StudentCreateDTO) {
    return this.userService.createUserStudent(data);
  }

  @ApiOperation({ description: 'Rota para criar usuário-professor.' })
  @Post('teacher')
  @IsPublic()
  async createUserTeacher(@Body() data: TeacherCreateDTO) {
    return this.userService.createUserTeacher(data);
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
}
