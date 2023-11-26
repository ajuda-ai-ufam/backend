import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
  PreconditionFailedException,
} from '@nestjs/common';
import { Monitor } from '@prisma/client';
import { PrismaService } from 'src/database/prisma.service';
import { EmailService } from 'src/email/email.service';
import { SubjectService } from 'src/subject/subject.service';
import { UserService } from 'src/user/user.service';
import { RequestMonitoringDto } from './dto/request-monitoring.dto';
import { TypeUser } from 'src/auth/enums/type-user.enum';

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

    const subjectEnrollment =
      await this.prismaService.subjectEnrollment.findFirst({
        where: {
          student_id: user_id,
          subject_id: data.subject_id,
          canceled_at: null,
        },
      });
    if (subjectEnrollment) {
      throw new PreconditionFailedException(
        'Você não pode estar matriculado(a) em uma disciplina que quer se tornar monitor(a).',
      );
    }

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

    await this.emailService.sendEmailRequestMonitoring(
      email,
      sub,
      context,
      template,
    );

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
      teacher.type_user_id != TypeUser.Coordinator &&
      teacher.type_user_id != TypeUser.SuperCoordinator
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

    await this.emailService.sendEmailAcceptMonitoring(
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

    if (teacher.type_user_id == TypeUser.Student)
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
      teacher.type_user_id != TypeUser.Coordinator &&
      teacher.type_user_id != TypeUser.SuperCoordinator
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

    await this.emailService.sendEmailRefuseMonitoring(email, sub, template);

    return { message: 'Solicitacão recusada!' };
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
