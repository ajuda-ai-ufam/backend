import { ApiProperty } from '@nestjs/swagger';

export class AcceptMonitoringDto {
  @ApiProperty()
  subject_id: number;

  @ApiProperty()
  student_id: number;
}
