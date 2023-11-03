import { ApiProperty } from '@nestjs/swagger';
import { Course } from 'src/course/domain/course';
import { StudentEnrollment } from 'src/enrollment/domain/enrollment';
import { User } from './user';

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

  @ApiProperty()
  subjectsEnrolled?: StudentEnrollment[];
}
