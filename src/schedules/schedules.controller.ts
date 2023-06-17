import {
  Body,
  Controller,
  ForbiddenException,
  Get,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Param,
  Post,
  PreconditionFailedException,
  Query,
  Req,
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
import { ParamIdDto } from 'src/common/dto/param-id.dto';
import { CancelScheduleCommand } from './commands/cancel-schedule.command';
import { EndScheduleCommand } from './commands/end-schedule.command';
import { ListEndingSchedulesCommand } from './commands/list-ending-schedules.command';
import { ListSchedulesCommand } from './commands/list-schedules.command';
import { EndScheduleRequestBody } from './dto/end-schedule.request.dto';
import { ListEndingSchedulesResponse } from './dto/list-ending-schedules.response.dto';
import { ListSchedulesQueryParams } from './dto/list-schedules.request.dto';
import { ListSchedulesResponse } from './dto/list-schedules.response.dto';
import {
  InvalidScheduleStatusException,
  NotFinalizedScheduleException,
  NotTheScheduleMonitorException,
  NotTheScheduleParticipantException,
  ProfessorNotAuthorizedException,
  ScheduleNotFoundException,
} from './utils/exceptions';
import { CreateTopicRequestBody } from './dto/create-topic.request.dto';
import { CreateTopicCommand } from './commands/create-topic.command';
import { Topic } from './dto/topic.dto';

@Controller('schedules')
@ApiTags('Schedules')
export class SchedulesController {
  constructor(
    private readonly cancelScheduleCommand: CancelScheduleCommand,
    private readonly endScheduleCommand: EndScheduleCommand,
    private readonly listSchedulesCommand: ListSchedulesCommand,
    private readonly listEndingSchedulesCommand: ListEndingSchedulesCommand,
    private readonly createTopicCommand: CreateTopicCommand,
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
    status: HttpStatus.FORBIDDEN,
    description: 'Você não tem autorização para performar esta ação.',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
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
        throw new ForbiddenException({ error: { message: error.message } });
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
    status: HttpStatus.FORBIDDEN,
    description: 'Você não tem autorização para performar esta ação.',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
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

  @ApiBearerAuth()
  @Roles(Role.Student)
  @Post(':id/end')
  @ApiOperation({
    summary: 'Finaliza um agendamento confirmado que já passou da hora de fim.',
  })
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'Alteração realizada',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'Apenas o monitor do agendamento pode realizar esta ação.',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Não foi encontrado um token de autenticação válido.',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Agendamento não encontrado.',
  })
  @ApiResponse({
    status: HttpStatus.PRECONDITION_FAILED,
    description:
      'Status de agendamento inválido || Agendamento não passou da hora de finalizar.',
  })
  async endSchedule(
    @Req() req: Request,
    @Param() param: ParamIdDto,
    @Body() body: EndScheduleRequestBody,
  ): Promise<void> {
    const token = req.headers.authorization.toString().replace('Bearer ', '');
    const user = this.jwtService.decode(token) as JWTUser;

    try {
      return await this.endScheduleCommand.execute(
        Number(param.id),
        user.sub,
        body.realized,
      );
    } catch (error) {
      if (
        error instanceof InvalidScheduleStatusException ||
        error instanceof NotFinalizedScheduleException
      ) {
        throw new PreconditionFailedException(error.message);
      }

      if (error instanceof NotTheScheduleMonitorException) {
        throw new ForbiddenException(error.message);
      }

      if (error instanceof ScheduleNotFoundException) {
        throw new NotFoundException(error.message);
      }

      throw error;
    }
  }

  @ApiBearerAuth()
  @Roles(Role.Student)
  @Post('topics')
  async createTopic(@Body() body: CreateTopicRequestBody): Promise<Topic> {
    try {
      return await this.createTopicCommand.execute(body.name);
    } catch (error) {
      throw error;
    }
  }

  @ApiBearerAuth()
  @Roles(Role.Student)
  @HttpCode(HttpStatus.NO_CONTENT)
  @Post(':id/cancel')
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'Agendamento cancelado.',
  })
  async cancelSchedule(
    @Req() req: Request,
    @Param() param: ParamIdDto,
  ): Promise<void> {
    const token = req.headers.authorization.toString().replace('Bearer ', '');
    const user = this.jwtService.decode(token) as JWTUser;

    try {
      return await this.cancelScheduleCommand.execute(
        Number(param.id),
        user.sub,
      );
    } catch (error) {
      if (error instanceof ScheduleNotFoundException) {
        throw new NotFoundException(error.message);
      }

      if (error instanceof NotTheScheduleParticipantException) {
        throw new ForbiddenException(error.message);
      }

      if (error instanceof InvalidScheduleStatusException) {
        throw new PreconditionFailedException(error.message);
      }

      throw error;
    }
  }
}
