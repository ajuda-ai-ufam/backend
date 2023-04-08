import { Role } from '../enums/role.enum';

export interface JWTUser {
  sub: number;
  username: string;
  type_user: {
    id: number;
    type: Role;
  };
  type_user_id: number;
  iat?: number;
  exp?: number;
}
