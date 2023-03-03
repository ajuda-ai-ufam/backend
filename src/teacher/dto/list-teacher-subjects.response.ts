import { ApiProperty } from '@nestjs/swagger';
import { Subject } from 'src/subject/domain/subject';

export class ListTeacherSubjectsResponse {
  @ApiProperty({ type: [Number] })
  data: Subject[];
}
