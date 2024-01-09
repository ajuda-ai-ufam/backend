import { ApiProperty } from '@nestjs/swagger';
import { Role } from 'src/auth/enums/role.enum';

export class UserTypeDTO {
  @ApiProperty()
  id: number;

  @ApiProperty()
  type: Role;
}

export class MonitorDTO {
  @ApiProperty()
  id: number;

  @ApiProperty()
  id_status: number;

  @ApiProperty()
  end_date: Date;

  @ApiProperty()
  responsible_professor_id: number;

  @ApiProperty()
  student_id: number;

  @ApiProperty()
  subject_id: number;
}

export class DepartmentDTO {
  @ApiProperty()
  id: number;

  @ApiProperty()
  code: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  abbreviation: string;
}

export class JWTUserDTO {
  @ApiProperty()
  sub: number;

  @ApiProperty()
  username: string;

  @ApiProperty()
  type_user: UserTypeDTO;

  @ApiProperty({ required: false })
  monitor?: MonitorDTO;

  @ApiProperty({ required: false })
  department?: DepartmentDTO;

  @ApiProperty()
  type_user_id: number;

  @ApiProperty({ required: false })
  iat?: number;

  @ApiProperty({ required: false })
  exp?: number;
}
