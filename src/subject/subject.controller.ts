import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Subject } from '@prisma/client';
import { QueryPaginationDto } from 'src/common/dto/query-pagination.dto';
import { IResponsePaginate } from 'src/common/interfaces/pagination.interface';
import { SubjectService } from './subject.service';

@Controller('subject')
@ApiTags('Disciplinas')
export class SubjectController {
  constructor(private readonly subjectService: SubjectService) {}

  @ApiOperation({ description: 'Rota para listar todas as disciplinas.' })
  @Get()
  async findAll(
    @Query() query: QueryPaginationDto,
  ): Promise<IResponsePaginate> {
    return await this.subjectService.findAll(query);
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Subject> {
    return await this.subjectService.findOne(+id);
  }
}
