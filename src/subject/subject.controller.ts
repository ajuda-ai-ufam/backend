import {
  BadRequestException,
  ConflictException,
  UnauthorizedException,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Param,
  Patch,
  Post,
  PreconditionFailedException,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Request } from 'express';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { Role } from 'src/auth/enums/role.enum';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { JWTUser } from 'src/auth/interfaces/jwt-user.interface';
import { IResponsePaginate } from 'src/common/interfaces/pagination.interface';
import { EndResponsabilityCommand } from './commands/end-responsability-command';
import { SubjectQueryDto } from './dto/subject-query.dto';
import { SubjectService } from './subject.service';
import {
  AlreadyFinishedException,
  BlockingMonitorsException,
  ResponsabilityNotFoundException,
  StudentAlreadyEnrolledException,
  StudentMonitorException,
  StudentNotEnrolledException,
  SubjectNotFoundException,
  UserNotStudentException,
} from './utils/exceptions';
import { CoordinatorIsNotFromDepartment } from 'src/teacher/utils/exceptions';

import { CancelSubjectEnrollmentCommand } from './commands/cancel-subject-enrollment.command';
import { CreateSubjectEnrollmentCommand } from './commands/create-subject-enrollment.command';
@Controller('subject')
@ApiTags('Subjects')
export class SubjectController {
  constructor(
    private readonly subjectService: SubjectService,
    private readonly endResponsabilityCommand: EndResponsabilityCommand,
    private readonly createSubjectEnrollmentCommand: CreateSubjectEnrollmentCommand,
    private readonly cancelSubjectEnrollmentCommand: CancelSubjectEnrollmentCommand,
    private jwtService: JwtService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ description: 'Rota para listar todas as disciplinas.' })
  @Get()
  async findAll(
    @Req() req: Request,
    @Query() query: SubjectQueryDto,
  ): Promise<IResponsePaginate> {
    const token = req.headers.authorization.toString().replace('Bearer ', '');
    const user = this.jwtService.decode(token) as JWTUser;

    try {
      return await this.subjectService.findAll(
        user.sub,
        user.type_user.type,
        query,
      );
    } catch (error) {
      if (error instanceof UserNotStudentException) {
        throw new BadRequestException(error.message);
      }

      throw error;
    }
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ description: 'Rota para listar todas as disciplinas sem paginação.' })
  @Get("/all")
  async findAllSemPaginacao(
    @Req() req: Request,
    @Query() query: SubjectQueryDto,
  ){
    const token = req.headers.authorization.toString().replace('Bearer ', '');
    const user = this.jwtService.decode(token) as JWTUser;

    try {
      return await this.subjectService.findAllSemPaginacao(
        user.sub,
        user.type_user.type,
        query,
      );
    } catch (error) {
      if (error instanceof UserNotStudentException) {
        throw new BadRequestException(error.message);
      }

      throw error;
    }
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Get(':id')
  async findOne(@Req() req: Request, @Param('id') id: number) {
    const token = req.headers.authorization.toString().replace('Bearer ', '');
    const user = this.jwtService.decode(token) as JWTUser;

    return await this.subjectService.findSubjectById(user.sub, id);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Roles(Role.Coordinator, Role.SuperCoordinator)
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    summary: 'Atualiza o status de uma responsabilidade para 3 (finalizada)',
  })
  @Patch('responsability/:id/end')
  async endResponsability(@Req() req: Request, @Param('id') id: number) {
    const token = req.headers.authorization.toString().replace('Bearer ', '');
    const user = this.jwtService.decode(token) as JWTUser;

    try {
      return await this.endResponsabilityCommand.execute(user, id);
    } catch (error) {
      if (error instanceof ResponsabilityNotFoundException) {
        throw new NotFoundException(error.message);
      }

      if (error instanceof CoordinatorIsNotFromDepartment) {
        throw new UnauthorizedException(error.message);
      }

      if (
        error instanceof AlreadyFinishedException ||
        error instanceof BlockingMonitorsException
      ) {
        throw new PreconditionFailedException(error.message);
      }

      throw error;
    }
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Roles(Role.Student)
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Cria uma matrícula do aluno logado na disciplina passada',
  })
  @Post(':id/enroll')
  async createSubjectEnrollment(@Req() req: Request, @Param('id') id: number) {
    try {
      const token = req.headers.authorization.toString().replace('Bearer ', '');
      const user = this.jwtService.decode(token) as JWTUser;

      return await this.createSubjectEnrollmentCommand.execute(id, user.sub);
    } catch (error) {
      if (error instanceof StudentAlreadyEnrolledException) {
        throw new ConflictException(error.message);
      }

      if (error instanceof StudentMonitorException) {
        throw new PreconditionFailedException(error.message);
      }

      if (error instanceof SubjectNotFoundException) {
        throw new NotFoundException(error.message);
      }

      throw error;
    }
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Roles(Role.Student)
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    summary: 'Cancela a matrícula do aluno logado na disciplina passada',
  })
  @Delete(':id/enroll')
  async cancelSubjectEnrollment(@Req() req: Request, @Param('id') id: number) {
    try {
      const token = req.headers.authorization.toString().replace('Bearer ', '');
      const user = this.jwtService.decode(token) as JWTUser;

      return await this.cancelSubjectEnrollmentCommand.execute(id, user.sub);
    } catch (error) {
      if (error instanceof StudentNotEnrolledException) {
        throw new PreconditionFailedException(error.message);
      }

      if (error instanceof SubjectNotFoundException) {
        throw new NotFoundException(error.message);
      }

      throw error;
    }
  }
}
