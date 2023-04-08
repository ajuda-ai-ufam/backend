import { ApiProperty } from '@nestjs/swagger';
import { Schedule } from '../domain/schedule';

class PaginationMeta {
  @ApiProperty({ type: Number })
  page: number;

  @ApiProperty({ type: Number })
  pageSize: number;

  @ApiProperty({ type: Number })
  totalItems: number;

  @ApiProperty({ type: Number })
  totalPages: number;
}

export class ListSchedulesResponse {
  @ApiProperty({ type: [Schedule] })
  data: Schedule[];

  @ApiProperty({ type: PaginationMeta })
  meta: PaginationMeta;
}
