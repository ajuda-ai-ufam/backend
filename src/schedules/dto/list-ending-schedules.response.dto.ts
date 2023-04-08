import { ApiProperty } from '@nestjs/swagger';
import { Schedule } from '../domain/schedule';

export class ListEndingSchedulesResponse {
  @ApiProperty({ type: [Schedule] })
  data: Schedule[];
}
