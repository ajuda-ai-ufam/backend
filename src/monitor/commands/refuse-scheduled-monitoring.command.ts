import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';
import { ScheduleStatus } from 'src/schedules/utils/schedules.enum';
import {
  NotTheScheduleMonitorException,
  ScheduleNotPendingException,
  ScheduledMonitoringNotFoundException,
} from '../utils/exceptions';
import { EmailService } from 'src/email/email.service';

@Injectable()
export class RefuseScheduledMonitoringCommand {
  constructor(
    private readonly prismaService: PrismaService,
    private emailService: EmailService,
  ) {}

  async execute(scheduleId: number, userId: number): Promise<any> {
    const schedule = await this.prismaService.scheduleMonitoring.findUnique({
      where: { id: scheduleId },
      include: {
        monitor: {
          include: {
            MonitorSettings: { where: { is_active: true } }, 
            student: { include: { user: true } }
          },
        },
        student: {
          include: { user: true },
        },
      },
    });
    if (!schedule) {
      throw new ScheduledMonitoringNotFoundException();
    }

    const preferential_place =
      schedule.monitor?.MonitorSettings?.[0]?.preferential_place ?? '-';

    if (schedule.id_status != ScheduleStatus.WAITING_APPROVAL) {
      throw new ScheduleNotPendingException();
    }

    if (schedule.monitor.student_id != userId) {
      throw new NotTheScheduleMonitorException();
    }

    await this.prismaService.scheduleMonitoring.update({
      data: { id_status: ScheduleStatus.CANCELED },
      where: { id: scheduleId },
    });

    const email = schedule.student.contact_email;

    await this.emailService.sendEmailRefuseScheduledMonitoring(
      email,
      'Cancelado',
      schedule.monitor.student.user.name,
      schedule.start.toLocaleDateString('pt-BR'),
      schedule.start.toLocaleTimeString('pt-BR').slice(0, 5),
      schedule.end.toLocaleTimeString('pt-BR').slice(0, 5),
      preferential_place,
    );

    return { message: 'Agendamento rejeitado!' };
  }
}
