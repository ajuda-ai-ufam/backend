import {
  Body,
  ConflictException,
  Controller,
  Get,
  HttpStatus,
  InternalServerErrorException,
  NotFoundException,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { ParamIdDto } from 'src/common/dto/param-id.dto';
import { QueryPaginationDto } from 'src/common/dto/query-pagination.dto';
import { IResponsePaginate } from 'src/common/interfaces/pagination.interface';
import { ListTeacherSubjectsCommand } from './commands/list-teacher-subjects.command';
import { ListTeacherSubjectsResponse } from './dto/list-teacher-subjects.response';
import { TeacherAssingDto } from './dto/teacher-assing.dto';
import { TeacherService } from './teacher.service';
import {
  TeacherAlreadyResponsibleException,
  TeacherNotFoundException,
} from './utils/exceptions';
import { AssignSubjectCommand } from './commands/assign-subject.command';
import { SubjectNotFoundException } from 'src/subject/utils/exceptions';

@Controller('teacher')
@ApiTags('Professors')
export class TeacherController {
  constructor(
    private readonly teacherService: TeacherService,
    private readonly listTeacherSubjectsCommand: ListTeacherSubjectsCommand,
    private readonly assignSubjectCommand: AssignSubjectCommand,
  ) {}
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Get()
  async findAll(
    @Query() query: QueryPaginationDto,
  ): Promise<IResponsePaginate> {
    return await this.teacherService.findAll(query);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary:
      'Assinala um professor a uma disciplina, criando uma responsabilidade.',
  })
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'Responsabilidade assinalada com sucesso.',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Professor ou disciplina não encontrados.',
  })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description: 'Professor já responsável pela disciplina.',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Token inválido.',
  })
  @Post('assign-subject')
  async assignSubject(@Body() body: TeacherAssingDto) {
    try {
      return await this.assignSubjectCommand.execute(body);
    } catch (error) {
      if (
        error instanceof SubjectNotFoundException ||
        error instanceof TeacherNotFoundException
      ) {
        throw new NotFoundException(error.message);
      }

      if (error instanceof TeacherAlreadyResponsibleException) {
        throw new ConflictException(error.message);
      }

      throw error;
    }
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Get(':id/subjects')
  @ApiOperation({
    summary:
      'Retorna as disciplinas de responsabilidade do professor cujo ID foi passado',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Disciplinas do professor',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Professor não encontrado.',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Token inválido.',
  })
  async getTeacherSubjects(
    @Param() params: ParamIdDto,
  ): Promise<ListTeacherSubjectsResponse> {
    try {
      const subjects = await this.listTeacherSubjectsCommand.execute(
        Number(params.id),
      );
      return { data: subjects };
    } catch (error) {
      if (error instanceof TeacherNotFoundException) {
        throw new NotFoundException(error.message);
      }

      throw new InternalServerErrorException(error.message);
    }
  }
}
