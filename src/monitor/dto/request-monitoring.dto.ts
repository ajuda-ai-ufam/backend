import { ApiProperty } from '@nestjs/swagger';

export class RequestMonitoringDto {
  @ApiProperty()
  subject_id: number;

  @ApiProperty()
  professor_id: number;
}

export class AcceptMonitoringDto {
  @ApiProperty()
  subject_id: number;

  @ApiProperty()
  student_id: number;
}
