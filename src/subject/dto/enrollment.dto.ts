import { ApiProperty } from '@nestjs/swagger';

export class Enrollment {
  @ApiProperty()
  id: number;

  @ApiProperty()
  student_id: number;

  @ApiProperty()
  subject_id: number;

  @ApiProperty()
  created_at: Date;

  @ApiProperty()
  updated_at: Date;

  @ApiProperty()
  canceled_at?: Date;
}
