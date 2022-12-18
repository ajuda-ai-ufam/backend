import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { QueryPaginationDto } from 'src/common/dto/query-pagination.dto';
import { IResponsePaginate } from 'src/common/interfaces/pagination.interface';
import { TeacherAssingDto } from './dto/teacher-assing.dto';
import { TeacherService } from './teacher.service';

@Controller('teacher')
@ApiTags('Professors')
export class TeacherController {
  constructor(private readonly teacherService: TeacherService) {}
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('access_token')
  @Get()
  async findAll(
    @Query() query: QueryPaginationDto,
  ): Promise<IResponsePaginate> {
    return await this.teacherService.findAll(query);
  }
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('access_token')
  @Post('assign-subject')
  async assignSubject(@Body() body: TeacherAssingDto) {
    return await this.teacherService.assignSubject(body);
  }
}
