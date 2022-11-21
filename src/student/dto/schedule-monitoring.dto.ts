import { ApiProperty } from '@nestjs/swagger';

export class ScheduleMonitoringDto {
  @ApiProperty()
  monitor_id: number;

  @ApiProperty()
  start: Date;

  @ApiProperty()
  end: Date;
}
