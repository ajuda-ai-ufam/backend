import { ApiProperty } from '@nestjs/swagger';
import { Course } from 'src/course/domain/course';

export class Subject {
  @ApiProperty({ type: Number })
  id: number;

  @ApiProperty({ type: String })
  name: string;

  // TODO - make not optional
  @ApiProperty({ type: String })
  code?: string;

  @ApiProperty({ type: Course })
  course: Course;
}
