import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, MaxLength } from 'class-validator';

export type AvailabilityDayPeriod = {
  start: string;
  end: string;
};

export type AvailabilityWeekDay = {
  weekDay: number;
  hours: AvailabilityDayPeriod[];
};

export class UpdateMonitorDTO {
  @IsOptional()
  @ApiProperty({
    type: 'array',
    items: {
      type: 'object',
      properties: {
        weekDay: {
          type: 'number',
        },
        hours: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              start: {
                type: 'string',
                example: '10:00',
              },
              end: {
                type: 'string',
                example: '12:00',
              },
            },
          },
        },
      },
    },
  })
  availability?: AvailabilityWeekDay[];

  @IsOptional()
  @ApiProperty()
  @IsString()
  @MaxLength(60)
  preferentialPlace?: string;
}
