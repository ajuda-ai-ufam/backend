import { ApiProperty } from '@nestjs/swagger';
import { Subject } from 'src/subject/domain/subject';
import { User } from 'src/user/domain/user';
import { ScheduleStatus } from '../utils/schedules.enum';

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

  @ApiProperty({ type: String })
  description?: string;

  @ApiProperty({ type: Monitor })
  monitor?: Monitor;

  @ApiProperty({ type: Student })
  student?: Student;

  @ApiProperty({ type: User })
  responsibleProfessor?: User;

  @ApiProperty({ type: Subject })
  subject?: Subject;
}
