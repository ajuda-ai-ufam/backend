import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { QueryPaginationDto } from 'src/common/dto/query-pagination.dto';
import { RequestMonitoringDto } from './dto/request-monitoring.dto';
import { MonitorService } from './monitor.service';

@ApiTags('Monitor')
@Controller('monitor')
export class MonitorController {
  constructor(private readonly monitorService: MonitorService) {}

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
}
