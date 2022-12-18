import { Body, Controller, Param, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { ScheduleMonitoringDto } from './dto/schedule-monitoring.dto';
import { StudentService } from './student.service';

@ApiTags('Students')
@Controller('student')
export class StudentController {
  constructor(private readonly studentService: StudentService) {}
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('access_token')
  @Post('schedule-monitoring/:id')
  async scheduleMonitoring(
    @Param('id') id: number,
    @Body() body: ScheduleMonitoringDto,
  ) {
    return this.studentService.scheduleMonitoring(+id, body);
  }
}
