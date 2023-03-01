import { ApiProperty } from '@nestjs/swagger';
import { ScheduleStatus } from '../utils/schedules.enum';

class User {
  @ApiProperty({ type: Number })
  id: number;

  @ApiProperty({ type: String })
  name: string;

  @ApiProperty({ type: String })
  email: string;
}

class Course {
  @ApiProperty({ type: Number })
  id: number;

  @ApiProperty({ type: String })
  name: string;
}

class Subject {
  @ApiProperty({ type: Number })
  id: number;

  @ApiProperty({ type: String })
  name: string;

  @ApiProperty({ type: Course })
  course: Course;
}

class Student extends User {
  @ApiProperty({ type: String })
  enrollment: string;
}

class Monitor extends Student {
  @ApiProperty({ type: Number })
  userId: number;
}

export class Schedule {
  @ApiProperty({ type: Number })
  id: number;

  @ApiProperty({ type: Date })
  startDate: Date;

  @ApiProperty({ type: Date })
  endDate: Date;

  @ApiProperty({ type: ScheduleStatus })
  status: ScheduleStatus;

  @ApiProperty({ type: Monitor })
  monitor: Monitor;

  @ApiProperty({ type: Student })
  student: Student;

  @ApiProperty({ type: User })
  responsibleProfessor: User;

  @ApiProperty({ type: Subject })
  subject: Subject;
}
