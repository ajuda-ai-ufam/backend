import { IsOptional, IsInt, IsDateString, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';

export class CreateExternalMonitoringDto {
  @IsOptional()
  @ApiProperty()
  student_id?: number;

  @ApiProperty()
  student_name: string;

  @ApiProperty()
  monitor_id: number;

  @ApiProperty()
  professor_id: number;

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

  @IsOptional()
  @ApiProperty()
  schedule_topic_id?: number;

  @IsOptional()
  @ApiProperty()
  description?: string;
}
