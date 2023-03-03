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
import { JWTUser } from 'src/auth/interfaces/jwt-user.interface';
import { ListEndingSchedulesCommand } from './commands/list-ending-schedules.command';
import { ListSchedulesCommand } from './commands/list-schedules.command';
import { ListEndingSchedulesResponse } from './dto/list-ending-schedules.response.dto';
import { ListSchedulesQueryParams } from './dto/list-schedules.request.dto';
import { ListSchedulesResponse } from './dto/list-schedules.response.dto';
import { ProfessorNotAuthorizedException } from './utils/exceptions';

@Controller('schedules')
@ApiTags('Schedules')
export class SchedulesController {
  constructor(
    private readonly listSchedulesCommand: ListSchedulesCommand,
    private readonly listEndingSchedulesCommand: ListEndingSchedulesCommand,
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
    const token = req.headers.authorization.toString().replace('Bearer ', '');
    const user = this.jwtService.decode(token) as JWTUser;

    const responsibleIds =
      typeof query.responsibleIds === 'number'
        ? [query.responsibleIds]
        : query.responsibleIds;

    const subjectIds =
      typeof query.subjectIds === 'number'
        ? [query.subjectIds]
        : query.subjectIds;

    try {
      return await this.listSchedulesCommand.execute(
        { ...query, responsibleIds, subjectIds },
        user.sub,
        user.type_user.type,
      );
    } catch (error) {
      if (error instanceof ProfessorNotAuthorizedException) {
        throw new UnauthorizedException({ error: { message: error.message } });
      }

      throw error;
    }
  }

  @ApiBearerAuth()
  @Roles(Role.Student)
  @Get('ending')
  @ApiOperation({
    summary: 'Retorna os agendamentos que precisam ser finalizados.',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Lista de agendamentos para finalizar',
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
    status: HttpStatus.NOT_FOUND,
    description: 'Nenhum agendamento a ser finalizado foi encontrado.',
  })
  async listEnding(@Req() req: Request): Promise<ListEndingSchedulesResponse> {
    let token = req.headers.authorization;
    token = token.toString().replace('Bearer ', '');
    const payload = this.jwtService.decode(`${token}`);

    return await this.listEndingSchedulesCommand.execute(payload.sub);
  }
}
