import { SubjectDTO } from './dto/subject.dto';
import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { QueryPaginationDto } from 'src/common/dto/query-pagination.dto';
import { IResponsePaginate } from 'src/common/interfaces/pagination.interface';
import { SubjectService } from './subject.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@Controller('subject')
@ApiTags('Subjects')
export class SubjectController {
  constructor(private readonly subjectService: SubjectService) {}
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ description: 'Rota para listar todas as disciplinas.' })
  @Get()
  async findAll(
    @Query() query: QueryPaginationDto,
  ): Promise<IResponsePaginate> {
    return await this.subjectService.findAll(query);
  }
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Get(':id')
  async findOne(@Param('id') id: number) {
    return await this.subjectService.listSubjects(id);
  }
}
