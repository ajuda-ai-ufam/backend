import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { QueryPaginationDto } from 'src/common/dto/query-pagination.dto';
import { IResponsePaginate } from 'src/common/interfaces/pagination.interface';
import { TeacherAssingDto } from './dto/teacher-assing.dto';
import { TeacherService } from './teacher.service';

@Controller('teacher')
@ApiTags('Professors')
export class TeacherController {
  constructor(private readonly teacherService: TeacherService) {}

  @Get()
  async findAll(
    @Query() query: QueryPaginationDto,
  ): Promise<IResponsePaginate> {
    return await this.teacherService.findAll(query);
  }

  @Post('assign-subject')
  async assignSubject(@Body() body: TeacherAssingDto) {
    return await this.teacherService.assignSubject(body);
  }
}
