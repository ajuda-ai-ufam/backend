import { ApiProperty } from '@nestjs/swagger';
import { Monitor } from '@prisma/client';
import { Type } from 'class-transformer';
import { IsOptional, IsString } from 'class-validator';
import { PaginationResponse } from 'src/common/dto/query-pagination.dto';
import { MonitorStatus } from '../utils/monitor.enum';

export class ListMonitorsQueryParams {
  @ApiProperty({
    required: false,
    description: 'Número da página',
    default: 1,
  })
  @IsOptional()
  @Type(() => Number)
  page?: number;

  @ApiProperty({
    required: false,
    description: 'Quantidade de registros por página',
    default: 10,
  })
  @IsOptional()
  @Type(() => Number)
  pageSize?: number;

  @ApiProperty({
    required: false,
    description: 'Busca pelo nome do monitor ou do professor responsável',
    type: String,
  })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiProperty({
    required: false,
    description: 'Busca pelo status da monitoria',
    type: MonitorStatus,
  })
  @Type(() => Number)
  @IsOptional()
  status?: MonitorStatus;
}

export class ListMonitorsResponse extends PaginationResponse<Monitor> {}
