import { ApiProperty } from '@nestjs/swagger';
import { QueryPaginationDto } from 'src/common/dto/query-pagination.dto';

export class SchedulesDto extends QueryPaginationDto {
  @ApiProperty({
    required: false,
    enum: ['monitor', 'student'],
  })
  eventType: 'monitor' | 'student';

  @ApiProperty({
    required: false,
  })
  status: number;
}
