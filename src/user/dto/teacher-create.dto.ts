import { ApiProperty } from '@nestjs/swagger';

export class TeacherCreateDTO {
  @ApiProperty()
  email: string;

  @ApiProperty()
  siape: string;

  @ApiProperty()
  department_id: number;

  @ApiProperty()
  name: string;

  @ApiProperty()
  password: string;

  @ApiProperty()
  confirm_password: string;
}
