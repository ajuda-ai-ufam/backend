import { ExtractJwt } from 'passport-jwt';
import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Put,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { QueryPaginationDto } from 'src/common/dto/query-pagination.dto';
import { AcceptMonitoringDto } from './dto/accept-monitoring.dto';
import { RequestMonitoringDto } from './dto/request-monitoring.dto';
import { MonitorService } from './monitor.service';
import { JwtStrategy } from 'src/auth/strategies/jwt.strategy';

@ApiTags('Monitor')
@Controller('monitor')
export class MonitorController {
  constructor(
    private readonly monitorService: MonitorService,
    private jwtService: JwtService,
  ) {}

  @Get('all')
  async findAll(@Query() query: QueryPaginationDto) {
    return this.monitorService.findAll(query);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.monitorService.findOne(+id);
  }

  @Post('request/:id')
  async requestMonitoring(
    @Param('id') id: string,
    @Body() body: RequestMonitoringDto,
  ) {
    return this.monitorService.requestMonitoring(+id, body);
  }

  @Patch('accept/:id_monitoring')
  async acceptMonitoring(
    @Req() req: Request,
    @Param('id_monitoring') id_monitoring: number,
  ) {
    let token = req.headers.access_token;
    token = token.toString().replace('Bearer ', '');
    const data_token = this.jwtService.decode(`${token}`);
    return this.monitorService.acceptMonitoring(id_monitoring, data_token.sub);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('access_token')
  @Post('accept/scheduled-monitoring/:id')
  async acceptScheduledMonitoring(@Param('id') id: string) {
    return this.monitorService.acceptScheduledMonitoring(+id);
  }
}
