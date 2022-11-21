import { Body, Controller, Param, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ScheduleMonitoringDto } from './dto/schedule-monitoring.dto';
import { StudentService } from './student.service';

@ApiTags('Alunos')
@Controller('student')
export class StudentController {
  constructor(private readonly studentService: StudentService) {}

  @Post('schedule-monitoring/:id')
  async scheduleMonitoring(
    @Param('id') id: number,
    @Body() body: ScheduleMonitoringDto,
  ) {
    return this.studentService.scheduleMonitoring(+id, body);
  }
}
