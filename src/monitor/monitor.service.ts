import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Monitor } from '@prisma/client';
import * as moment from 'moment';
import { PrismaService } from 'src/database/prisma.service';
import { EmailService } from 'src/email/email.service';
import { SubjectService } from 'src/subject/subject.service';
import { UserService } from 'src/user/user.service';
import { MonitorAvailabilityDto } from './dto/monitor-availability.dto';
import { RequestMonitoringDto } from './dto/request-monitoring.dto';

@Injectable()
export class MonitorService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly subjectService: SubjectService,
    private readonly userService: UserService,
    private readonly emailService: EmailService,
  ) {}
  async requestMonitoring(user_id: number, data: RequestMonitoringDto) {
    const user = await this.userService.findOneById(user_id);
    if (!user) throw new NotFoundException('Usuário(a) não encontrado(a).');
    if (user.type_user_id != 1)
      throw new ForbiddenException('Usuário(a) não é um(a) aluno(a)');

    const subject = await this.subjectService.findOne(data.subject_id);
    if (!subject) throw new NotFoundException('Disciplina não encontrada.');

    const subjectResponsability =
      await this.prismaService.subjectResponsability.findMany({
        where: { subject_id: data.subject_id },
      });

    if (!subjectResponsability)
      throw new BadRequestException(
        'Não há nenhum responsável pela disciplina!',
      );

    const verify_professor =
      await this.prismaService.subjectResponsability.findFirst({
        where: { subject_id: data.subject_id, professor_id: data.professor_id },
      });

    if (!verify_professor)
      throw new BadRequestException(
        'Este(a) professor(a) não é responsável por esta disciplina.',
      );

    const professor = await this.userService.findOneById(data.professor_id);

    if (!professor)
      throw new NotFoundException('Professor(a) não encontrado(a).');

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
    const sub = 'Você recebeu uma nova solicitação!';
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

    if (!teacher)
      throw new NotFoundException('Professor(a) não encontrado(a).');

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

    if (request_monitor.id_status == 5)
      throw new BadRequestException('Sua solicitacão ja foi recusada.');

    await this.prismaService.monitor.update({
      data: { id_status: 2 },
      where: { id: request_monitor.id },
    });

    const email: string = student.email;
    const sub = 'Você foi aceito!';
    const template = 'accept_monitor';
    const subject_id = request_monitor.subject_id;

    this.emailService.sendEmailAcceptMonitoring(
      email,
      sub,
      template,
      subject_id,
    );

    return { message: 'Solicitacão aceita!' };
  }

  async refuseMonitoring(id_monitoring: number, id_teacher: number) {
    const teacher = await this.userService.findOneById(id_teacher);

    if (!teacher)
      throw new NotFoundException('Professor(a) não encontrado(a).');

    if (teacher.type_user_id == 1)
      throw new BadRequestException(
        'Você não tem permissão para recusar solicitações.',
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
        'Você não tem permissão para recusar esta solicitação.',
      );

    if (request_monitor.id_status != 1)
      throw new BadRequestException(
        'Esta solicitacão não pode ser recusada, somente se estiver Pendente.',
      );

    await this.prismaService.monitor.update({
      data: { id_status: 5 },
      where: { id: request_monitor.id },
    });

    const email: string = student.email;
    const sub = 'Obrigado por tentar...';
    const template = 'refuse_monitor';

    this.emailService.sendEmailRefuseMonitoring(email, sub, template);

    return { message: 'Solicitacão recusada!' };
  }

  async registerAvailability(userId: number, data: MonitorAvailabilityDto) {
    const monitor = await this.prismaService.monitor.findFirst({
      where: {
        OR: [{ id_status: 2 }, { id_status: 3 }],
        AND: { student_id: userId },
      },
    });

    if (!monitor) throw new NotFoundException('Monitor(a) não encontrado(a)');

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

    if (monitor.id_status == 2) await this.updateStatusMonitor(monitor.id);

    return { message: 'Disponibilidade registrada!' };
  }

  async updateStatusMonitor(id: number) {
    return await this.prismaService.monitor.update({
      data: {
        id_status: 3,
      },
      where: { id: id },
    });
  }

  async clearMonitorAvailability(monitor: Monitor) {
    await this.prismaService.availableTimes.deleteMany({
      where: { monitor_id: monitor.id },
    });
  }

  async getMonitorAvailability(monitorId: number) {
    const monitor = await this.prismaService.monitor.findFirst({
      where: {
        id: monitorId,
      },
    });

    if (!monitor) throw new NotFoundException('Monitor(a) não encontrado(a).');

    return this.prismaService.availableTimes.findMany({
      where: { monitor_id: monitor.id },
      orderBy: { week_day: 'asc' },
    });
  }
}
