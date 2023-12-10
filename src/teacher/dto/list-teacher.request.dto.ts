import { ApiProperty } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import { IsNumber, IsOptional } from 'class-validator';

export class ListTeachersQueryParams {
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

  @ApiProperty({
    required: false,
    description: 'Incluir monitores na resposta',
  })
  @Transform(({ value }) => value && value === 'true')
  includeMonitors: boolean;

  @ApiProperty({
    required: false,
    description: 'Filtrar professores por departamento',
    type: [Number],
  })
  @IsNumber({}, { each: true })
  @Type(() => Number)
  @IsOptional()
  departmentIds: number[];

  @ApiProperty({
    required: false,
    description: 'Busca por monitores',
  })
  monitor: string;

  @ApiProperty({
    required: false,
    description: 'Filtrar disciplinas por ID',
    type: [String],
  })
  subjectIds: string[];
}
