import { Controller, Get, Query } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { QueryDto } from './dto/query.dto';
import { SubjectService } from './subject.service';

@Controller('subject')
@ApiTags('Disciplinas')
export class SubjectController {
  constructor(private readonly subjectService: SubjectService) {}

  @ApiOperation({description: "Rota para listar todas as disciplinas."})
  @Get()
  async findAll(@Query() query: QueryDto) {
    return this.subjectService.findAll(query);
  }
}
