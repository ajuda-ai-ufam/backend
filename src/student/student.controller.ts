import {
  BadRequestException,
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  Post,
  PreconditionFailedException,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Request } from 'express';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { JWTUser } from 'src/auth/interfaces/jwt-user.interface';
import { ListStudentSchedulesCommand } from './commands/list-student-schedules.command';
import { ScheduleMonitoringCommand } from './commands/schedule-monitoring.command';
import { ScheduleMonitoringDto } from './dto/schedule-monitoring.dto';
import { SchedulesDto } from './dto/schedules.dto';
import {
  InvalidDateException,
  MonitorNotFoundException,
  MonitorStatusNotAvailableException,
  MonitorTimeAlreadyScheduledException,
  NotAnAvailableTimeException,
  SameStudentException,
  StudentTimeAlreadyScheduledException,
} from './utils/exceptions';

@ApiTags('Students')
@Controller('student')
export class StudentController {
  constructor(
    private readonly scheduleMonitoringCommand: ScheduleMonitoringCommand,
    private readonly listStudentSchedulesCommand: ListStudentSchedulesCommand,
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
    const user = this.jwtService.decode(token) as JWTUser;

    try {
      return await this.scheduleMonitoringCommand.execute(
        user.sub,
        monitor_id,
        body,
      );
    } catch (error) {
      if (error instanceof MonitorNotFoundException) {
        throw new NotFoundException(error.message);
      }

      if (
        error instanceof InvalidDateException ||
        error instanceof SameStudentException
      ) {
        throw new BadRequestException(error.message);
      }

      if (
        error instanceof MonitorStatusNotAvailableException ||
        error instanceof MonitorStatusNotAvailableException ||
        error instanceof NotAnAvailableTimeException ||
        error instanceof MonitorTimeAlreadyScheduledException ||
        error instanceof StudentTimeAlreadyScheduledException
      ) {
        throw new PreconditionFailedException(error.message);
      }

      throw error;
    }
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
