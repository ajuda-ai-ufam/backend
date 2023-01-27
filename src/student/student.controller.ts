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
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { ScheduleMonitoringDto } from './dto/schedule-monitoring.dto';
import { StudentService } from './student.service';
import { Request } from 'express';
import { JwtService } from '@nestjs/jwt';
import { QueryPaginationDto } from 'src/common/dto/query-pagination.dto';

@ApiTags('Students')
@Controller('student')
export class StudentController {
  constructor(
    private readonly studentService: StudentService,
    private readonly jwtService: JwtService,
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
    return this.studentService.scheduleMonitoring(student_id, monitor_id, body);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Get('/schedules')
  async findOne(@Req() req: Request, @Query() query: QueryPaginationDto) {
    let token = req.headers.authorization;
    token = token.toString().replace('Bearer ', '');
    const data_token = this.jwtService.decode(`${token}`);
    return this.studentService.findOne(+data_token.sub);
  }
}
