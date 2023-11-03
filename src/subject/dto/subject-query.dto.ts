import { ApiProperty } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import { IsOptional, Validate, IsNumber } from 'class-validator';
import { QueryPaginationDto } from 'src/common/dto/query-pagination.dto';
import { MonitorStatus } from 'src/monitor/utils/monitor.enum';
import { EnumValidator } from '../../enum-validator.validator';

export class SubjectQueryDto extends QueryPaginationDto {
  @ApiProperty({
    required: false,
    type: Boolean,
    description: 'Disciplinas Matriculadas',
  })
  @Transform(({ value }) => value && value === 'true')
  @IsOptional()
  onlyEnrollments?: boolean;

  @ApiProperty({
    required: false,
    description: 'ID do professor',
  })
  @IsOptional()
  teacherId?: number;

  @ApiProperty({
    required: false,
    description: 'Status de monitoria',
    type: [Number],
  })
  @IsOptional()
  @IsNumber({}, { each: true })
  @Type(() => Number)
  @Transform(({ value }) => {
    if (typeof value === 'number') {
      return [value];
    } else if (Array.isArray(value)) {
      return value;
    } else {
      return [];
    }
  })
  @Validate(EnumValidator, [MonitorStatus])
  monitorStatus?: number[];
}
