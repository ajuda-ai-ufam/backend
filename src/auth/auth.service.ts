import {
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { comparePassword } from 'src/utils/bcrypt';
import { UserService } from '../user/user.service';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.userService.findOneByEmail(email);

    if (user && (await comparePassword(password, user.password))) {
      if (!user.is_verified)
        throw new ForbiddenException('Usuário não verificado.');
      return { id: user.id, username: user.name,type_user_id: user.type_user_id,type_user: user.type_user };
    }
    throw new UnauthorizedException('Usuário ou senha inválidos.');
  }

  async login(data: LoginDto) {
    const user = await this.validateUser(data.email, data.password);
    const payload = { sub: user.id, username: user.username,type_user: user.type_user,type_user_id:user.type_user_id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
