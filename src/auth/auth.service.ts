import {
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { comparePassword } from 'src/utils/bcrypt';
import { UserService } from '../user/user.service';
import { LoginDto } from './dto/login.dto';
import { Role } from './enums/role.enum';
import { JWTUser } from './interfaces/jwt-user.interface';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.userService.findOneByEmailWithOnGoingMonitor(email);

    if (user && (await comparePassword(password, user.password))) {
      if (!user.is_verified)
        throw new ForbiddenException('Usuário(a) não verificado(a).');

      const monitor = !!user.student?.Monitor?.length
        ? user.student.Monitor[0]
        : undefined;

      let coordinadorDepartment = undefined;
      if (user.type_user.type == Role.Coordinator) {
        coordinadorDepartment = (
          await this.userService.findOneByIdWithDepartment(user.id)
        ).department;
      }

      if (user.type_user.type == Role.Professor) {
        coordinadorDepartment = (
          await this.userService.findOneTeacherByIdWithDepartment(user.id)
        ).department;
      }

      return {
        id: user.id,
        username: user.name,
        type_user_id: user.type_user_id,
        type_user: user.type_user,
        department: coordinadorDepartment,
        monitor,
      };
    }
    throw new UnauthorizedException('Usuário(a) ou senha inválidos.');
  }

  async login(data: LoginDto) {
    const user = await this.validateUser(data.email, data.password);
    const payload: JWTUser = {
      sub: user.id,
      username: user.username,
      type_user: user.type_user,
      type_user_id: user.type_user_id,
      monitor: user.monitor,
      department: user.department,
    };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
