import { ApiProperty } from '@nestjs/swagger';

export class TeacherAssingDto {
  @ApiProperty({ type: [Number] })
  professors_ids: number[];

  @ApiProperty()
  subject_id: number;
}
