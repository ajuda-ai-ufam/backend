import {
  Body,
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
import { TeacherNotFoundException } from './utils/exceptions';

@Controller('teacher')
@ApiTags('Professors')
export class TeacherController {
  constructor(
    private readonly teacherService: TeacherService,
    private readonly listTeacherSubjectsCommand: ListTeacherSubjectsCommand,
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
  @Post('assign-subject')
  async assignSubject(@Body() body: TeacherAssingDto) {
    return await this.teacherService.assignSubject(body);
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
