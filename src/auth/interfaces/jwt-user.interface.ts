import { Role } from '../enums/role.enum';

export interface JWTUser {
  sub: number;
  username: string;
  type_user: {
    id: number;
    type: Role;
  };
  monitor?: {
    id: number;
    id_status: number;
    end_date: Date;
    responsible_professor_id: number;
    student_id: number;
    subject_id: number;
  };
  department?: {
    id: number;
    code: string;
    name: string;
    abbreviation: string;
  };
  type_user_id: number;
  iat?: number;
  exp?: number;
}
