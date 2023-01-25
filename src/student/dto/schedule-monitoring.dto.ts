import { ApiProperty } from '@nestjs/swagger';

export class ScheduleMonitoringDto {
  @ApiProperty({
    example: '2023-01-20 10:00:00',
  })
  start: string;

  @ApiProperty({
    example: '2023-01-20 11:00:00',
  })
  end: string;
}
