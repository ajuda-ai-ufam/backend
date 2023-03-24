import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  PreconditionFailedException,
} from '@nestjs/common';
import * as moment from 'moment';
import { PrismaService } from 'src/database/prisma.service';
import { ScheduleMonitoringDto } from '../dto/schedule-monitoring.dto';
import { FindOneByIdCommand } from './find-one-by-id.command';
import { GetMonitorAvailabilityCommand } from './get-monitor-availability.command';

@Injectable()
export class ScheduleMonitoringCommand {
  constructor(
    private prisma: PrismaService,
    private readonly findOneByIdCommand: FindOneByIdCommand,
    private readonly getMonitorAvailabilityCommand: GetMonitorAvailabilityCommand,
  ) {}

  /**
   * TODO: Resolve Promise<any> return type
   */
  async execute(
    student_id: number,
    monitor_id: number,
    data: ScheduleMonitoringDto,
  ): Promise<any> {
    const user = await this.findOneByIdCommand.execute(student_id);
    if (!user) throw new ForbiddenException('Aluno não encontrado.');

    const monitor = await this.prisma.monitor.findFirst({
      where: { id: monitor_id },
    });
    if (!monitor) throw new ForbiddenException('Monitor não encontrado.');

    if (
      monitor.id_status == 5 ||
      monitor.id_status == 1 ||
      monitor.id_status == 4
    )
      throw new PreconditionFailedException('Monitor não disponível.');

    if (monitor.id_status !== 3)
      throw new PreconditionFailedException('Monitor não disponível');

    if (user.user_id === monitor.student_id)
      throw new PreconditionFailedException(
        'Não foi possível agendar a monitoria, aluno e monitor são o mesmo usuário.',
      );

    data.start = moment(data.start).format('YYYY-MM-DDTHH:mm:ssZ');
    data.end = moment(data.end).format('YYYY-MM-DDTHH:mm:ssZ');

    if (!moment(data.start).isBefore(moment(data.end)))
      throw new BadRequestException(
        'Data de início deve ser anterior a data de término',
      );

    const start_weekday = moment(data.start).day();
    const start_minute = moment(data.start).minute();
    const start_hour = moment(data.start).hour();
    const start_time = `${start_hour < 10 ? '0' + start_hour : start_hour}:${
      start_minute < 10 ? '0' + start_minute : start_minute
    }`;

    const end_weekday = moment(data.end).day();
    const end_minute = moment(data.end).minute();
    const end_hour = moment(data.end).hour();
    const end_time = `${end_hour < 10 ? '0' + end_hour : end_hour}:${
      end_minute < 10 ? '0' + end_minute : end_minute
    }`;

    const monitorAvailability = await this.getMonitorAvailabilityCommand.execute(monitor.id);

    const sameDay = monitorAvailability.filter(
      (item) =>
        item.week_day === start_weekday && item.week_day === end_weekday,
    );

    if (sameDay.length === 0)
      throw new PreconditionFailedException(
        'Monitor não disponível nas datas selecionadas.',
      );

    sameDay.forEach((item) => {
      if (
        moment(start_time, 'HH:mm').isBefore(moment(item.start, 'HH:mm')) ||
        moment(start_time, 'HH:mm').isAfter(moment(item.end, 'HH:mm'))
      )
        throw new PreconditionFailedException(
          'Monitor não disponível no horário selecionado',
        );
      if (
        moment(end_time, 'HH:mm').isBefore(moment(item.start, 'HH:mm')) ||
        moment(end_time, 'HH:mm').isAfter(moment(item.end, 'HH:mm'))
      )
        throw new PreconditionFailedException(
          'Monitor não disponível no horário selecionado',
        );
    });

    await this.prisma.scheduleMonitoring.create({
      data: {
        student_id: student_id,
        monitor_id: monitor.id,
        start: data.start,
        end: data.end,
      },
    });
    return { message: 'Monitoria agendada com sucesso' };
  }
}