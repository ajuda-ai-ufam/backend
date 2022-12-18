import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { CourseService } from './course.service';

@Controller('course')
@ApiTags('Course')
export class CourseController {
  constructor(private readonly courseService: CourseService) {}

  @ApiOperation({ description: 'Rota para listar todos os cursos.' })
  @Get()
  findAll() {
    return this.courseService.findAll();
  }
}
