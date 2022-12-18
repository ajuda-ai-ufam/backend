import { ApiProperty } from '@nestjs/swagger';

export type hours = {
  start: string;
  end: string;
};

export type days = {
  weekDay: number;
  hours: hours[];
};

export class MonitorAvailabilityDto {
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
  availability: days[];
}
