import { ApiProperty } from '@nestjs/swagger';

export class QueryPaginationDto {
  @ApiProperty({
    required: false,
    description: 'Quantidade de registros por página',
  })
  quantity: number;

  @ApiProperty({
    required: false,
    description: 'Número da página',
  })
  page: number;

  @ApiProperty({
    required: false,
    description: 'Coluna para ordenação',
  })
  field: string;

  @ApiProperty({
    required: false,
    description: 'Ordenação ascendente ou descendente',
    enum: ['asc', 'desc'],
  })
  order: string;

  @ApiProperty({
    required: false,
    description: 'Termo de busca',
  })
  search: string;
}

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

export class PaginationResponse<T> {
  @ApiProperty()
  data: T[];

  @ApiProperty({ type: PaginationMeta })
  meta: PaginationMeta;
}
