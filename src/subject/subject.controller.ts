import { Controller, Get, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { QueryDto } from './dto/query.dto';
import { SubjectService } from './subject.service';

@Controller('subject')
@ApiTags('Disciplinas')
export class SubjectController {
  constructor(private readonly subjectService: SubjectService) {}

  @Get()
  async findAll(@Query() query: QueryDto) {
    return await this.subjectService.findAll(query);
  }
}
