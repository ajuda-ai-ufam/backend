import { ApiProperty } from '@nestjs/swagger';
import { ScheduleStatus } from '../utils/schedules.enum';

class PaginationMeta {
  @ApiProperty({ type: Number })
  page: number;

  @ApiProperty({ type: Number })
  pageSize: number;

  @ApiProperty({ type: Number })
  totalItems: number;

  @ApiProperty({ type: Number })
  totalPages: number;
}

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

export class ListSchedulesResponse {
  @ApiProperty({ type: [Schedule] })
  data: Schedule[];

  @ApiProperty({ type: PaginationMeta })
  meta: PaginationMeta;
}
