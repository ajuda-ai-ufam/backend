import {
  BadRequestException,
  Body,
  Controller,
  ForbiddenException,
  Get,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Param,
  Patch,
  Post,
  PreconditionFailedException,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RequestMonitoringDto } from './dto/request-monitoring.dto';
import { MonitorService } from './monitor.service';
import { MonitorAvailabilityDto } from './dto/monitor-availability.dto';
import { JWTUser } from 'src/auth/interfaces/jwt-user.interface';
import { ListMonitorsQueryParams } from './dto/list-monitors.request.dto';
import { ListMonitorsCommand } from './commands/list-monitors.command';
import { AcceptScheduleCommand } from './commands/accept-schedule.command';
import {
  InvalidScheduleStatusException,
  NotTheScheduleMonitorException,
  OverdueScheduleException,
  ScheduleNotFoundException,
} from 'src/schedules/utils/exceptions';
import { MonitorTimeAlreadyScheduledException } from 'src/student/utils/exceptions';

@ApiTags('Monitor')
@Controller('monitor')
export class MonitorController {
  constructor(
    private readonly monitorService: MonitorService,
    private readonly acceptScheduleCommand: AcceptScheduleCommand,
    private readonly listMonitorsCommand: ListMonitorsCommand,
    private jwtService: JwtService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Get('all')
  async findAll(@Req() req: Request, @Query() query: ListMonitorsQueryParams) {
    const token = req.headers.authorization.toString().replace('Bearer ', '');
    const user = this.jwtService.decode(token) as JWTUser;
    return this.listMonitorsCommand.execute(
      user.sub,
      user.type_user.type,
      query,
    );
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Post('request/')
  async requestMonitoring(
    @Req() req: Request,
    @Body() body: RequestMonitoringDto,
  ) {
    let token = req.headers.authorization;
    token = token.toString().replace('Bearer ', '');
    const data_token = this.jwtService.decode(`${token}`);
    return this.monitorService.requestMonitoring(+data_token.sub, body);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Patch('/:id_monitoring/refuse')
  async refuseMonitoring(
    @Req() req: Request,
    @Param('id_monitoring') id_monitoring: number,
  ) {
    let token = req.headers.authorization;
    token = token.toString().replace('Bearer ', '');
    const data_token = this.jwtService.decode(`${token}`);
    return this.monitorService.refuseMonitoring(id_monitoring, data_token.sub);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Patch('/:id_monitoring/accept')
  async acceptMonitoring(
    @Req() req: Request,
    @Param('id_monitoring') id_monitoring: number,
  ) {
    let token = req.headers.authorization;
    token = token.toString().replace('Bearer ', '');
    const data_token = this.jwtService.decode(`${token}`);
    return this.monitorService.acceptMonitoring(id_monitoring, data_token.sub);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Post('accept/scheduled-monitoring/:scheduleId')
  @HttpCode(HttpStatus.NO_CONTENT)
  async acceptScheduledMonitoring(
    @Req() req: Request,
    @Param('scheduleId') scheduleId: number,
  ) {
    const token = req.headers.authorization.toString().replace('Bearer ', '');
    const user = this.jwtService.decode(token) as JWTUser;

    try {
      return await this.acceptScheduleCommand.execute(
        user.sub,
        Number(scheduleId),
      );
    } catch (error) {
      if (error instanceof ScheduleNotFoundException) {
        throw new NotFoundException(error.message);
      }

      if (error instanceof NotTheScheduleMonitorException) {
        throw new ForbiddenException(error.message);
      }

      if (error instanceof InvalidScheduleStatusException) {
        throw new BadRequestException(error.message);
      }

      if (
        error instanceof MonitorTimeAlreadyScheduledException ||
        error instanceof OverdueScheduleException
      ) {
        throw new PreconditionFailedException(error.message);
      }

      throw error;
    }
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Post('refuse/scheduled-monitoring/:scheduled_monitoring_id')
  async refuseScheduledMonitoring(
    @Req() req: Request,
    @Param('scheduled_monitoring_id') scheduled_monitoring_id: string,
  ) {
    const token = req.headers.authorization.toString().replace('Bearer ', '');
    const payload = this.jwtService.decode(token);
    return this.monitorService.refuseScheduledMonitoring(
      +scheduled_monitoring_id,
      payload.sub,
    );
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Post('availability')
  async registerAvailability(
    @Req() req: Request,
    @Body() body: MonitorAvailabilityDto,
  ) {
    const token = req.headers.authorization.toString().replace('Bearer ', '');
    const dataToken = this.jwtService.decode(`${token}`);
    return this.monitorService.registerAvailability(+dataToken.sub, body);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Get('availability/:monitorId')
  async getMonitorAvailability(@Param('monitorId') monitorId: string) {
    return this.monitorService.getMonitorAvailability(+monitorId);
  }
}
