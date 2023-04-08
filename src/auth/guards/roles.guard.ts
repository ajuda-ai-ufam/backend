import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { ROLES_KEY } from '../decorators/roles.decorator';
import { Role } from '../enums/role.enum';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector, private jwtService: JwtService) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!requiredRoles) {
      return true;
    }

    const authToken = context.switchToHttp().getRequest().headers.authorization;
    if (!authToken) {
      throw new UnauthorizedException({
        error: {
          message: 'Não foi encontrado um token de autenticação válido.',
        },
      });
    }

    const payload = this.jwtService.decode(authToken.replace('Bearer ', ''));
    if (
      !requiredRoles.some(
        (role) => role === (payload['type_user']['type'] as unknown as Role),
      )
    ) {
      throw new ForbiddenException({
        error: {
          message: 'Você não tem autorização para performar esta ação.',
        },
      });
    }

    return true;
  }
}
