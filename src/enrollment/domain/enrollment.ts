import { ApiProperty } from '@nestjs/swagger';
import { Subject } from 'src/subject/domain/subject';
import { Student } from 'src/user/domain/student';

class Enrollment {
  @ApiProperty()
  id: number;

  @ApiProperty()
  created_at: Date;

  @ApiProperty()
  canceled_at?: Date;
}

export class StudentEnrollment extends Enrollment {
  @ApiProperty()
  subject: Subject;
}

export class SubjectEnrollment extends Enrollment {
  @ApiProperty()
  student: Student;
}
