import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { QueryPaginationDto } from 'src/common/dto/query-pagination.dto';
import { AcceptMonitoringDto } from './dto/accept-monitoring.dto';
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

  @Put('accept/:id')
  async acceptMonitoring(
    @Param('id') id: number,
    @Body() body: AcceptMonitoringDto,
  ) {
    return this.monitorService.acceptMonitoring(id, body);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('access_token')
  @Post('accept/scheduled-monitoring/:id')
  async acceptScheduledMonitoring(@Param('id') id: string) {
    return this.monitorService.acceptScheduledMonitoring(+id);
  }
}
