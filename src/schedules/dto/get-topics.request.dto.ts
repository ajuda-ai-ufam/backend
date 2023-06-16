import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsOptional, IsString } from 'class-validator';

export class GetTopicsQueryParams {
  @ApiProperty({
    required: false,
    description: 'Buscar assunto pelo nome',
    type: String,
  })
  @IsString()
  @IsOptional()
  name: string;

  @ApiProperty({
    required: false,
    description: 'Quantidade de registros por página',
    default: 10,
  })
  @IsOptional()
  @Type(() => Number)
  pageSize: number;

  @ApiProperty({
    required: false,
    description: 'Número da página',
    default: 1,
  })
  @IsOptional()
  @Type(() => Number)
  page: number;
}
