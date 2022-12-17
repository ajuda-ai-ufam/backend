import { SubjectDTO } from './dto/subject.dto';
import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { QueryPaginationDto } from 'src/common/dto/query-pagination.dto';
import { IResponsePaginate } from 'src/common/interfaces/pagination.interface';
import { SubjectService } from './subject.service';

@Controller('subject')
@ApiTags('Subjects')
export class SubjectController {
  constructor(private readonly subjectService: SubjectService) {}

  @ApiOperation({ description: 'Rota para listar todas as disciplinas.' })
  @Get()
  async findAll(
    @Query() query: QueryPaginationDto,
  ): Promise<IResponsePaginate> {
    return await this.subjectService.findAll(query);
  }

  @Get('/details')
  async findOne(
    @Query() query: QueryPaginationDto,
    @Query() subject: SubjectDTO,
  ): Promise<IResponsePaginate> {
    return await this.subjectService.listSubjects(query, subject);
  }
}
