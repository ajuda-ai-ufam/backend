import { ApiProperty } from '@nestjs/swagger';
import { User } from './user';
import { Course } from 'src/course/domain/course';

export class Student extends User {
  @ApiProperty({ type: String })
  contactEmail: string;

  @ApiProperty({ type: String })
  description: string;

  @ApiProperty({ type: String })
  enrollment: string;

  @ApiProperty({ type: String })
  whatsapp?: string;

  @ApiProperty({ type: String })
  linkedin?: string;

  @ApiProperty({ type: Number })
  courseId?: number;

  @ApiProperty({ type: Course })
  course?: Course;
}
