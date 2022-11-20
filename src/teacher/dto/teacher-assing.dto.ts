import { ApiProperty } from '@nestjs/swagger';

export class TeacherAssingDto {
  @ApiProperty()
  professor_id: number;

  @ApiProperty()
  subject_id: number;
}
