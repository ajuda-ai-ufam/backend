import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';

export class ScheduleMonitoringDto {
  @ApiProperty({
    example: '2023-01-20 10:00:00',
  })
  @Transform(({ value }) => value && new Date(value))
  start: Date;

  @ApiProperty({
    example: '2023-01-20 11:00:00',
  })
  @Transform(({ value }) => value && new Date(value))
  end: Date;
}
