import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { QueryPaginationDto } from 'src/common/dto/query-pagination.dto';
import { RequestMonitoringDto } from './dto/request-monitoring.dto';
import { MonitorService } from './monitor.service';
import { MonitorAvailabilityDto } from './dto/monitor-availability.dto';

@ApiTags('Monitor')
@Controller('monitor')
export class MonitorController {
  constructor(
    private readonly monitorService: MonitorService,
    private jwtService: JwtService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Get('all')
  async findAll(@Req() req: Request, @Query() query: QueryPaginationDto) {
    let token = req.headers.authorization;
    token = token.toString().replace('Bearer ', '');
    const data_token = this.jwtService.decode(`${token}`);
    return this.monitorService.findAll(data_token.sub, query);
  }

  // @UseGuards(JwtAuthGuard)
  // @ApiBearerAuth()
  // @Get('/schedules/:user_id')
  // async findOne(@Param('user_id') user_id: string) {
  //   return this.monitorService.findOne(+user_id);
  // }

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
  @Post('accept/scheduled-monitoring/:scheduled_monitoring_id')
  async acceptScheduledMonitoring(
    @Req() req: Request,
    @Param('scheduled_monitoring_id') scheduled_monitoring_id: string,
  ) {
    const token = req.headers.authorization.toString().replace('Bearer ', '');
    const payload = this.jwtService.decode(token);
    return this.monitorService.acceptScheduledMonitoring(
      +scheduled_monitoring_id,
      payload.sub,
    );
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
