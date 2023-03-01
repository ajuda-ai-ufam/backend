import { ApiProperty } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import {
  IsDate,
  IsNumber,
  IsOptional,
  IsString,
  Length,
} from 'class-validator';
import { ScheduleStatus } from '../utils/schedules.enum';

export class ListSchedulesQueryParams {
  @ApiProperty({
    type: Date,
    example: '2023-01-01',
    required: false,
    description: 'Data de início',
  })
  @Transform(({ value }) => value && new Date(value))
  @IsDate()
  @IsOptional()
  startDate?: Date;

  @ApiProperty({
    type: Date,
    example: '2023-02-01',
    required: false,
    description: 'Data de fim',
  })
  @IsDate()
  @Transform(({ value }) => value && new Date(value))
  @IsOptional()
  endDate?: Date;

  @ApiProperty({
    required: false,
    description: 'Número da página',
    default: 1,
  })
  @IsOptional()
  @Type(() => Number)
  page: number;

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
    description: 'ID do status do agendamento',
  })
  @IsOptional()
  @Type(() => Number)
  status: ScheduleStatus;

  @ApiProperty({
    required: false,
    description: 'IDs das disciplinas dos agendamentos',
    type: [Number],
  })
  @IsNumber({}, { each: true })
  @Type(() => Number)
  @IsOptional()
  subjectIds: number[];

  @ApiProperty({
    required: false,
    description: 'IDs dos professores responsáveis pelos monitores',
    type: [Number],
  })
  @IsNumber({}, { each: true })
  @Type(() => Number)
  @IsOptional()
  responsibleIds: number[];

  @ApiProperty({
    required: false,
    description: 'Busca pelo nome dos alunos e monitores participantes',
    type: String,
  })
  @IsString()
  @IsOptional()
  studentName: string;

  @ApiProperty({
    required: false,
    description: 'Busca pela matrícula dos alunos e monitores participantes',
    type: String,
    maxLength: 8,
    minLength: 8,
  })
  @Length(8, 8)
  @IsString()
  @IsOptional()
  studentEnrollment: string;
}
