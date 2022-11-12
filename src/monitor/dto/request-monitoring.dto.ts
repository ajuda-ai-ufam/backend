import { ApiProperty } from '@nestjs/swagger';

export class RequestMonitoringDto {
  @ApiProperty()
  subject_id: number;

  @ApiProperty()
  professor_id: number;
}
