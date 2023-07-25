import { ApiProperty } from '@nestjs/swagger';
import { Teacher } from 'src/user/domain/teacher';
import { Subject } from 'src/subject/domain/subject';
import { Student } from 'src/user/domain/student';

class Availability {
  @ApiProperty({ type: Number })
  id: number;

  @ApiProperty({ type: Number })
  week_day: number;

  @ApiProperty({ type: Date })
  start: Date;

  @ApiProperty({ type: Date })
  end: Date;
}

export class MonitorSettings {
  @ApiProperty({ type: Number })
  id: number;

  @ApiProperty({ type: String })
  preferentialPlace: string;

  @ApiProperty({ type: Boolean })
  isActive: boolean;
}

export class Monitor {
  @ApiProperty({ type: Number })
  id: number;

  @ApiProperty({ type: String })
  status: string;

  @ApiProperty({ type: Date })
  endDate: Date;

  @ApiProperty({ type: Student })
  student?: Student;

  @ApiProperty({ type: Subject })
  subject?: Subject;

  @ApiProperty({ type: Teacher })
  responsible?: Teacher;

  @ApiProperty({ type: MonitorSettings })
  monitorSettings?: MonitorSettings;

  @ApiProperty({ type: [Availability] })
  availability?: Availability[];
}
