import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Request } from 'express';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { ListStudentSchedulesCommand } from './commands/list-student-schedules.command';
import { ScheduleMonitoringCommand } from './commands/schedule-monitoring.command';
import { ScheduleMonitoringDto } from './dto/schedule-monitoring.dto';
import { SchedulesDto } from './dto/schedules.dto';

@ApiTags('Students')
@Controller('student')
export class StudentController {
  constructor(
    private readonly scheduleMonitoringCommand: ScheduleMonitoringCommand,
    private readonly listStudentSchedulesCommand: ListStudentSchedulesCommand,
    private readonly jwtService: JwtService
  ) {}

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Post(':monitor_id/schedule')
  async scheduleMonitoring(
    @Req() req: Request,
    @Param('monitor_id') monitor_id: number,
    @Body() body: ScheduleMonitoringDto,
  ) {
    const token = req.headers.authorization.toString().replace('Bearer ', '');
    const payload = this.jwtService.decode(token);
    const student_id = payload.sub as number;
    return this.scheduleMonitoringCommand.execute(student_id, monitor_id, body);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Get('/schedules')
  async findOne(@Req() req: Request, @Query() query: SchedulesDto) {
    let token = req.headers.authorization;
    token = token.toString().replace('Bearer ', '');
    const data_token = this.jwtService.decode(`${token}`);
    return this.listStudentSchedulesCommand.execute(+data_token.sub, query);
  }
}
