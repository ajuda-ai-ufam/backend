import {
  Controller,
  Get,
  HttpStatus,
  Query,
  Req,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Request } from 'express';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { Role } from 'src/auth/enums/role.enum';
import { ListSchedulesCommand } from './commands/list-schedules.command';
import { ListSchedulesQueryParams } from './dto/list-schedules.request.dto';
import { ListSchedulesResponse } from './dto/list-schedules.response.dto';

@Controller('schedules')
@ApiTags('Schedules')
export class SchedulesController {
  constructor(
    private readonly listSchedulesCommand: ListSchedulesCommand,
    private readonly jwtService: JwtService,
  ) {}

  @ApiBearerAuth()
  @Roles(Role.Professor, Role.Coordinator)
  @Get()
  @ApiOperation({ summary: 'Filtra agendamentos' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Filtro com sucesso',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Você não tem autorização para performar esta ação.',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'Não foi encontrado um token de autenticação válido.',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Um ou mais campos informados são inválidos.',
  })
  async index(
    @Req() req: Request,
    @Query() query: ListSchedulesQueryParams,
  ): Promise<ListSchedulesResponse> {
    let token = req.headers.authorization;
    token = token.toString().replace('Bearer ', '');
    const payload = this.jwtService.decode(`${token}`);

    if (
      payload['type_user']['type'] === Role.Professor &&
      (query.responsibleIds || query.responsibleIds?.length > 0)
    ) {
      throw new UnauthorizedException({
        error: {
          message: 'Você não tem permissão para performar esta ação',
        },
      });
    }

    return await this.listSchedulesCommand.execute(query);
  }
}
