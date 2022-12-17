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

@Injectable()
export class MonitorService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly subjectService: SubjectService,
    private readonly userService: UserService,
    private readonly emailService: EmailService,
  ) {}

  async findAll(query: QueryPaginationDto): Promise<IResponsePaginate> {
    const monitors = await this.prismaService.monitor.findMany({
      include: {
        student: {
          select: {
            user: { select: { name: true } },
            course: { select: { name: true, code: true } },
          },
        },
        subject: true,
        responsible_professor: { select: { user: { select: { name: true } } } },
        status: { select: { status: true } },
      },
    });

    return pagination(monitors, query);
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

    const professor = await this.userService.findOneById(data.professor_id);

    if (!professor) throw new NotFoundException('Professor não encontrado.');

    const email: string = professor.email;
    const sub: string = process.env.SUBJECT_NEW_MONITORING;
    const context = 'Você tem uma nova solicitação de monitoria.';

    this.emailService.sendEmailM(email, sub, context);

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

    const request_monitor = await this.prismaService.monitor.findFirst({
      where: { id: id_monitoring },
    });

    if (!request_monitor)
      throw new NotFoundException('Solicitação não encontrada!');

    if (request_monitor.id_status == 2)
      throw new BadRequestException('Sua solicitacão ja foi aprovada.');

    if (
      request_monitor.responsible_professor_id != id_teacher &&
      teacher.type_user_id != 3
    )
      throw new BadRequestException(
        'Você não tem permissão para aceitar esta monitoria.',
      );

    await this.prismaService.monitor.update({
      data: { id_status: 2 },
      where: { id: request_monitor.id },
    });

    return { message: 'Solicitacão aceita!' };
  }

  async acceptScheduledMonitoring(schedule_id: number) {
    const schedule = await this.prismaService.scheduleMonitoring.findUnique({
      where: { id: schedule_id },
    });
    if (!schedule) throw new NotFoundException('Agendamento não encontrado');

    await this.prismaService.scheduleMonitoring.update({
      data: { id_status: 2 },
      where: { id: schedule_id },
    });

    return { message: 'Agendamento aceito!' };
  }
}
