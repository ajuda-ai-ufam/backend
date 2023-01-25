import { EmailService } from 'src/email/email.service';
import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Monitor } from '@prisma/client';
import { elementAt } from 'rxjs';
import { QueryPaginationDto } from 'src/common/dto/query-pagination.dto';
import { IResponsePaginate } from 'src/common/interfaces/pagination.interface';
import { pagination } from 'src/common/pagination';
import { PrismaService } from 'src/database/prisma.service';
import { SubjectService } from 'src/subject/subject.service';
import { UserService } from 'src/user/user.service';
import { AcceptMonitoringDto } from './dto/accept-monitoring.dto';
import { RequestMonitoringDto } from './dto/request-monitoring.dto';
import { MonitorAvailabilityDto } from './dto/monitor-availability.dto';
import * as moment from 'moment';
import { query } from 'express';
import { serialize } from 'v8';

@Injectable()
export class MonitorService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly subjectService: SubjectService,
    private readonly userService: UserService,
    private readonly emailService: EmailService,
  ) {}

  async findAll(
    id: number,
    query: QueryPaginationDto,
  ): Promise<IResponsePaginate> {
    const new_monitors = [];

    const professor = await this.userService.findOneById(id);

    if (!professor) throw new NotFoundException('Professor não encontrado.');
    if (professor.type_user_id == 2) {
      const monitors = await this.prismaService.monitor.findMany({
        where: { responsible_professor_id: id },
        include: {
          student: {
            select: {
              user: { select: { name: true } },
              course: { select: { name: true, code: true } },
            },
          },
          subject: true,
          responsible_professor: {
            select: { user: { select: { name: true } } },
          },
          status: { select: { status: true } },
        },
      });
      if (query.search) {
        monitors.forEach((element) => {
          if (
            element.student.user.name
              .toLowerCase()
              .includes(query.search.toString().toLowerCase()) ||
            element.responsible_professor.user.name
              .toLowerCase()
              .includes(query.search.toString().toLowerCase())
          ) {
            new_monitors.push(element);
          }
        });

        return pagination(new_monitors, query);
      } else {
        return pagination(monitors, query);
      }
    } else if (professor.type_user_id == 3) {
      const monitors = await this.prismaService.monitor.findMany({
        include: {
          student: {
            select: {
              user: { select: { name: true } },
              course: { select: { name: true, code: true } },
            },
          },
          subject: true,
          responsible_professor: {
            select: { user: { select: { name: true } } },
          },
          status: { select: { status: true } },
        },
      });
      if (query.search) {
        monitors.forEach((element) => {
          if (
            element.student.user.name
              .toLowerCase()
              .includes(query.search.toString().toLowerCase()) ||
            element.responsible_professor.user.name
              .toLowerCase()
              .includes(query.search.toString().toLowerCase())
          ) {
            new_monitors.push(element);
          }
        });

        return pagination(new_monitors, query);
      } else {
        return pagination(monitors, query);
      }
    } else {
      throw new BadRequestException('Você não possui acesso.');
    }
  }

  async findOne(id: number): Promise<Monitor> {
    const monitor = await this.prismaService.monitor.findUnique({
      where: {
        id,
      },
      include: {
        student: true,
        subject: true,
        responsible_professor: true,
        ScheduleMonitoring: true,
        AvailableTimes: true,
      },
    });
    if (!monitor) {
      throw new NotFoundException('Monitor não encontrado');
    }
    return monitor;
  }

  async requestMonitoring(user_id: number, data: RequestMonitoringDto) {
    const user = await this.userService.findOneById(user_id);
    if (!user) throw new NotFoundException('Usuário não encontrado.');
    if (user.type_user_id != 1)
      throw new ForbiddenException('Usuário não é um aluno');

    const subject = await this.subjectService.findOne(data.subject_id);
    if (!subject) throw new NotFoundException('Disciplina não encontrada.');

    const subjectResponsability =
      await this.prismaService.subjectResponsability.findMany({
        where: { subject_id: data.subject_id },
      });

    if (!subjectResponsability)
      throw new BadRequestException(
        'Não há nenhum responsavel pela disciplina!',
      );

    const verify_professor =
      await this.prismaService.subjectResponsability.findFirst({
        where: { subject_id: data.subject_id, professor_id: data.professor_id },
      });

    if (!verify_professor)
      throw new BadRequestException(
        'Este professor não é responsável por esta disciplina.',
      );

    const professor = await this.userService.findOneById(data.professor_id);

    if (!professor) throw new NotFoundException('Professor não encontrado.');

    const hasMonitoring = await this.prismaService.monitor.findFirst({
      where: {
        student_id: user_id,
        id_status: {
          in: [1, 2, 3],
        },
      },
      include: { status: true },
    });

    if (hasMonitoring)
      throw new BadRequestException(
        `Você já possui uma monitoria com o status: ${hasMonitoring.status.status}`,
      );

    const email: string = professor.email;
    const sub: string = process.env.REQUEST_MONITORING;
    const context = { student_name: user.name, subject_name: subject.name };
    const template = 'request_monitor';

    this.emailService.sendEmailRequestMonitoring(email, sub, context, template);

    await this.prismaService.monitor.create({
      data: {
        responsible_professor_id: data.professor_id,
        student_id: user_id,
        subject_id: data.subject_id,
      },
    });
    return { message: 'Solicitação enviada!' };
  }

  async acceptMonitoring(id_monitoring: number, id_teacher: number) {
    const teacher = await this.userService.findOneById(id_teacher);

    if (!teacher) throw new NotFoundException('Professor não encontrado.');

    if (teacher.type_user_id == 1)
      throw new BadRequestException(
        'Você não tem permissão para aceitar solicitações.',
      );

    const request_monitor = await this.prismaService.monitor.findFirst({
      where: { id: id_monitoring },
    });

    if (!request_monitor)
      throw new NotFoundException('Solicitação não encontrada!');

    const student = await this.userService.findOneById(
      request_monitor.student_id,
    );

    if (
      request_monitor.responsible_professor_id != id_teacher &&
      teacher.type_user_id != 3
    )
      throw new BadRequestException(
        'Você não tem permissão para aceitar esta solicitação.',
      );

    if (request_monitor.id_status == 2)
      throw new BadRequestException('Sua solicitacão ja foi aprovada.');

    await this.prismaService.monitor.update({
      data: { id_status: 2 },
      where: { id: request_monitor.id },
    });

    const email: string = student.email;
    const sub: string = process.env.ACCEPT_MONITORING;
    const template = 'accept_monitor';

    this.emailService.sendEmailAcceptMonitoring(email, sub, template);

    return { message: 'Solicitacão aceita!' };
  }

  // verificar se já existe um agendamento aceito para o mesmo horário

  async acceptScheduledMonitoring(schedule_id: number, user_id: number) {
    const schedule = await this.prismaService.scheduleMonitoring.findUnique({
      where: { id: schedule_id },
    });
    if (!schedule) throw new NotFoundException('Agendamento não encontrado');

    if (schedule.id_status != 1)
      throw new BadRequestException(
        'Não é mais possível aceitar este agendamento',
      );

    if (schedule.monitor_id != user_id)
      throw new ForbiddenException(
        'Você não tem permissão para aceitar este agendamento',
      );

    await this.prismaService.scheduleMonitoring.update({
      data: { id_status: 2 },
      where: { id: schedule_id },
    });

    return { message: 'Agendamento aceito!' };
  }

  async registerAvailability(userId: number, data: MonitorAvailabilityDto) {
    const monitor = await this.prismaService.monitor.findFirst({
      where: {
        student_id: userId,
      },
    });

    if (!monitor) throw new NotFoundException('Monitor não encontrado');

    if (!data.availability.length)
      throw new BadRequestException('Nenhum horário informado');

    data.availability.forEach((day) => {
      if (day.weekDay < 0 || day.weekDay > 6)
        throw new BadRequestException('Dia da semana inválido');
      day.hours.forEach((hour) => {
        const hourRegex = /^([0-1]?[\d]|2[0-3]):[0-5][\d]$/;
        if (!hourRegex.test(hour.start) || !hourRegex.test(hour.end))
          throw new BadRequestException('Formato de hora inválido');
        const start = moment(hour.start, 'HH:mm');
        const end = moment(hour.end, 'HH:mm');
        if (!start.isValid() || !end.isValid())
          throw new BadRequestException('Horário inválido');
        if (start.isSameOrAfter(end))
          throw new BadRequestException(
            'Horário de início deve ser menor que o horário de fim',
          );
      });
    });

    await this.clearMonitorAvailability(monitor);

    data.availability.forEach((day) => {
      day.hours.forEach(async (hour) => {
        try {
          await this.prismaService.availableTimes.create({
            data: {
              week_day: day.weekDay,
              start: hour.start,
              end: hour.end,
              monitor_id: monitor.id,
            },
          });
        } catch (error) {
          console.log(error);
        }
      });
    });

    return { message: 'Disponibilidade registrada!' };
  }

  async clearMonitorAvailability(monitor: Monitor) {
    await this.prismaService.availableTimes.deleteMany({
      where: { monitor_id: monitor.id },
    });
  }

  async getMonitorAvailability(userId: number) {
    const monitor = await this.prismaService.monitor.findFirst({
      where: {
        student_id: userId,
      },
    });

    if (!monitor) throw new NotFoundException('Monitor não encontrado');

    return this.prismaService.availableTimes.findMany({
      where: { monitor_id: monitor.id },
      orderBy: { week_day: 'asc' },
    });
  }
}
