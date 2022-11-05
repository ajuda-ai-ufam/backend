import { Controller, Get, Query } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { QueryPaginationDto } from 'src/common/dto/query-pagination.dto';
import { ResponsePagination } from 'src/common/pagination';
import { SubjectService } from './subject.service';

@Controller('subject')
@ApiTags('Disciplinas')
export class SubjectController {
  constructor(private readonly subjectService: SubjectService) {}

  @ApiOperation({ description: 'Rota para listar todas as disciplinas.' })
  @Get()
  async findAll(
    @Query() query: QueryPaginationDto,
  ): Promise<ResponsePagination> {
    return await this.subjectService.findAll(query);
  }
}
