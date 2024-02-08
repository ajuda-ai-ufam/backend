import {
  BadRequestException,
  Body,
  Controller,
  ForbiddenException,
  UnauthorizedException,
  Get,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Param,
  Patch,
  Post,
  PreconditionFailedException,
  Query,
  Req,
  UseGuards,
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
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { JWTUser } from 'src/auth/interfaces/jwt-user.interface';
import {
  InvalidScheduleStatusException,
  NotTheScheduleMonitorException,
  OverdueScheduleException,
  ScheduleNotFoundException,
} from 'src/schedules/utils/exceptions';
import {
  MonitorNotFoundException,
  MonitorTimeAlreadyScheduledException,
} from 'src/student/utils/exceptions';
import { CoordinatorIsNotFromDepartment } from 'src/teacher/utils/exceptions';
import { AcceptScheduleCommand } from './commands/accept-schedule.command';
import { EndMonitoringCommand } from './commands/end-monitoring.command';
import { GetMonitorCommand } from './commands/get-monitor.command';
import { ListMonitorsCommand } from './commands/list-monitors.command';
import { RefuseScheduledMonitoringCommand } from './commands/refuse-scheduled-monitoring.command';
import { UpdateMonitorCommand } from './commands/update-monitor.command';
import { Monitor } from './domain/monitor';
import { ListMonitorsQueryParams } from './dto/list-monitors.request.dto';
import { RequestMonitoringDto } from './dto/request-monitoring.dto';
import {CreateExternalMonitoringDto} from './dto/external-monitoring.dto';
import { UpdateMonitorDTO } from './dto/update-monitor.dto';
import { MonitorService } from './monitor.service';
import {
  EditMonitorBodyMissingFieldsException,
  EmptyAvailabilityException,
  InvalidMonitoringStatusException,
  InvalidPreferentialPlaceException,
  MonitoringNotFoundException,
  NotTheResponsibleProfessorException,
  ScheduleNotPendingException,
  ScheduledMonitoringNotFoundException,
  UserLoggedNotResponsableForMonitoringException,
  InvalidTokenException
} from './utils/exceptions';

@ApiTags('Monitor')
@Controller('monitor')
export class MonitorController {
  constructor(
    private readonly monitorService: MonitorService,
    private readonly refuseScheduledMonitoringCommand: RefuseScheduledMonitoringCommand,
    private readonly acceptScheduleCommand: AcceptScheduleCommand,
    private readonly getMonitorCommand: GetMonitorCommand,
    private readonly listMonitorsCommand: ListMonitorsCommand,
    private readonly endMonitoringCommand: EndMonitoringCommand,
    private readonly updateMonitorCommand: UpdateMonitorCommand,
    private jwtService: JwtService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Get('all')
  async findAll(@Req() req: Request, @Query() query: ListMonitorsQueryParams) {
    const token = req.headers.authorization.toString().replace('Bearer ', '');
    const user = this.jwtService.decode(token) as JWTUser;
    return this.listMonitorsCommand.execute(
      user.sub,
      user.type_user.type,
      query,
    );
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Get(':monitorId')
  @ApiOperation({ summary: 'Retorna os dados de um monitor.' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Busca realizada com sucesso.',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Monitor não encontrado.',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Não foi encontrado um token de autenticação válido.',
  })
  async getMonitor(@Param('monitorId') monitorId: string): Promise<Monitor> {
    try {
      return await this.getMonitorCommand.execute(+monitorId);
    } catch (error) {
      if (error instanceof MonitorNotFoundException) {
        throw new NotFoundException(error.message);
      }
      throw error;
    }
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Post('request/')
  async requestMonitoring(
    @Req() req: Request,
    @Body() body: RequestMonitoringDto,
  ) {
    let token = req.headers.authorization;
    token = token.toString().replace('Bearer ', '');
    const data_token = this.jwtService.decode(`${token}`);
    return this.monitorService.requestMonitoring(+data_token.sub, body);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Patch('/:id_monitoring/refuse')
  @Roles(Role.Professor, Role.Coordinator, Role.SuperCoordinator)
  async refuseMonitoring(
    @Req() req: Request,
    @Param('id_monitoring') id_monitoring: number,
  ) {
    const token = req.headers.authorization.toString().replace('Bearer ', '');
    const user = this.jwtService.decode(token) as JWTUser;

    return this.monitorService.refuseMonitoring(user, id_monitoring);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Patch('/:id_monitoring/accept')
  @Roles(Role.Professor, Role.Coordinator, Role.SuperCoordinator)
  async acceptMonitoring(
    @Req() req: Request,
    @Param('id_monitoring') id_monitoring: number,
  ) {
    const token = req.headers.authorization.toString().replace('Bearer ', '');
    const user = this.jwtService.decode(token) as JWTUser;

    return this.monitorService.acceptMonitoring(user, id_monitoring);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Post('accept/scheduled-monitoring/:scheduleId')
  @HttpCode(HttpStatus.NO_CONTENT)
  async acceptScheduledMonitoring(
    @Req() req: Request,
    @Param('scheduleId') scheduleId: number,
  ) {
    const token = req.headers.authorization.toString().replace('Bearer ', '');
    const user = this.jwtService.decode(token) as JWTUser;

    try {
      return await this.acceptScheduleCommand.execute(
        user.sub,
        Number(scheduleId),
      );
    } catch (error) {
      if (error instanceof ScheduleNotFoundException) {
        throw new NotFoundException(error.message);
      }

      if (error instanceof NotTheScheduleMonitorException) {
        throw new ForbiddenException(error.message);
      }

      if (error instanceof InvalidScheduleStatusException) {
        throw new BadRequestException(error.message);
      }

      if (
        error instanceof MonitorTimeAlreadyScheduledException ||
        error instanceof OverdueScheduleException
      ) {
        throw new PreconditionFailedException(error.message);
      }

      throw error;
    }
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Post('refuse/scheduled-monitoring/:scheduleId')
  async refuseScheduledMonitoring(
    @Req() req: Request,
    @Param('scheduleId') scheduleId: string,
  ) {
    const token = req.headers.authorization.toString().replace('Bearer ', '');
    const payload = this.jwtService.decode(token);

    try {
      return await this.refuseScheduledMonitoringCommand.execute(
        +scheduleId,
        payload.sub,
      );
    } catch (error) {
      if (error instanceof ScheduledMonitoringNotFoundException) {
        throw new NotFoundException(error.message);
      }

      if (error instanceof ScheduleNotPendingException) {
        throw new BadRequestException(error.message);
      }

      if (error instanceof NotTheScheduleMonitorException) {
        throw new ForbiddenException(error.message);
      }

      throw error;
    }
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Patch('/:id')
  @Roles(Role.Student)
  async editMonitorAvailability(
    @Req() req: Request,
    @Body() body: UpdateMonitorDTO,
    @Param('id') monitorId: number,
  ) {
    const token = req.headers.authorization.toString().replace('Bearer ', '');
    const user = this.jwtService.decode(token) as JWTUser;

    try {
      return await this.updateMonitorCommand.execute(
        monitorId,
        user.sub,
        body.preferentialPlace,
        body.availability,
      );
    } catch (error) {
      if (
        error instanceof EditMonitorBodyMissingFieldsException ||
        error instanceof EmptyAvailabilityException ||
        error instanceof InvalidPreferentialPlaceException
      ) {
        throw new BadRequestException(error.message);
      }

      if (error instanceof InvalidMonitoringStatusException) {
        throw new PreconditionFailedException(error.message);
      }

      if (error instanceof MonitoringNotFoundException) {
        throw new NotFoundException(error.message);
      }

      if (error instanceof UserLoggedNotResponsableForMonitoringException) {
        throw new ForbiddenException(error.message);
      }

      throw error;
    }
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Roles(Role.Professor, Role.Coordinator, Role.SuperCoordinator)
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    summary: 'Atualiza o status de uma monitoria para 4 (finalizada)',
  })
  @Patch(':monitorId/end')
  async endMonitoring(
    @Req() req: Request,
    @Param('monitorId') monitorId: string,
  ) {
    try {
      const token = req.headers.authorization.toString().replace('Bearer ', '');
      const user = this.jwtService.decode(token) as JWTUser;
      return await this.endMonitoringCommand.execute(
        +monitorId,
        user,
        user.type_user.type,
      );
    } catch (error) {
      if (error instanceof MonitoringNotFoundException) {
        throw new NotFoundException(error.message);
      }

      if (error instanceof CoordinatorIsNotFromDepartment) {
        throw new UnauthorizedException(error.message);
      }

      if (error instanceof NotTheResponsibleProfessorException) {
        throw new ForbiddenException(error.message);
      }

      if (error instanceof InvalidMonitoringStatusException) {
        throw new PreconditionFailedException(error.message);
      }

      throw error;
    }
  }
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Post('external-monitoring')
  async externalMonitoring(
    @Body() body: CreateExternalMonitoringDto,    
  ) {
    try{
      return await this.monitorService.createExternalMonitoring(body);
    } catch (error) {
      if (error instanceof InvalidTokenException) {
        throw new UnauthorizedException(error.message);
      }
      else{
        throw new BadRequestException(error.message);
      }
    }
  }
}
