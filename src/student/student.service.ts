import { elementAt } from 'rxjs';
import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
  PreconditionFailedException,
} from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';
import { ScheduleMonitoringDto } from './dto/schedule-monitoring.dto';
import { StudentDTO } from './dto/student.dto';
import * as moment from 'moment';
import { pagination } from 'src/common/pagination';
import { SchedulesDto } from './dto/schedules.dto';

@Injectable()
export class StudentService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: StudentDTO) {
    const student = await this.prisma.student.create({ data: data });
    return student;
  }

  async findEnrollment(enrollment: string) {
    const user_enrollment = await this.prisma.student.findFirst({
      where: { enrollment: enrollment },
    });
    return user_enrollment;
  }

  async findOneById(id: number) {
    const user_student = await this.prisma.student.findUnique({
      where: { user_id: id },
    });
    return user_student;
  }

  async scheduleMonitoring(
    student_id: number,
    monitor_id: number,
    data: ScheduleMonitoringDto,
  ) {
    const user = await this.findOneById(student_id);
    if (!user) throw new ForbiddenException('Aluno não encontrado.');

    const monitor = await this.prisma.monitor.findFirst({
      where: { student_id: monitor_id },
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

    const monitorAvailability = await this.getMonitorAvailability(monitor.id);

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

  async getMonitorAvailability(monitor_id: number) {
    return this.prisma.availableTimes.findMany({
      where: { monitor_id },
      orderBy: { week_day: 'asc' },
    });
  }

  async listSchedules(user_id: number, query: SchedulesDto) {
    const studentInclude = {
      include: {
        course: true,
        user: {
          select: { name: true },
        },
      },
    };

    const monitor = await this.prisma.monitor.findFirst({
      where: {
        student_id: user_id,
      },
      include: {
        student: studentInclude,
      },
    });

    let orStatement = [{ student_id: user_id }, { monitor_id: monitor?.id }];
    if (query.eventType === 'monitor') {
      orStatement = [{ monitor_id: monitor?.id }];
    } else if (query.eventType === 'student') {
      orStatement = [{ student_id: user_id }];
    }

    const schedule = await this.prisma.scheduleMonitoring.findMany({
      where: {
        OR: orStatement,
        AND: [{ id_status: Number(query.status) || undefined }],
      },
      include: {
        monitor: { include: { student: studentInclude, subject: true } },
        student: studentInclude,
      },
    });

    if (!schedule) throw new NotFoundException('Agendamentos nao encontrados.');

    schedule.forEach((element) => {
      if (element.monitor_id == monitor?.id) element['is_monitoring'] = true;
      else element['is_monitoring'] = false;
    });

    return pagination(schedule, query);
  }
}
