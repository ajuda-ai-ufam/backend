import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';
export class SubjectDTO {
  @ApiProperty()
  id: number;

  @ApiProperty()
  filter: number;
}
