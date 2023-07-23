import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';
import { EmailService } from 'src/email/email.service';
import {
  InvalidScheduleStatusException,
  NotTheScheduleMonitorException,
  OverdueScheduleException,
  ScheduleNotFoundException,
} from 'src/schedules/utils/exceptions';
import { ScheduleStatus } from 'src/schedules/utils/schedules.enum';
import { MonitorTimeAlreadyScheduledException } from 'src/student/utils/exceptions';

@Injectable()
export class AcceptScheduleCommand {
  constructor(
    private readonly prisma: PrismaService,
    private emailService: EmailService,
  ) {}

  async execute(userId: number, scheduleId: number): Promise<void> {
    const schedule = await this.prisma.scheduleMonitoring.findUnique({
      where: { id: scheduleId },
      include: {
        monitor: {
          include: {
            MonitorSettings: { where: { is_active: true } },
            student: { include: { user: true } },
          },
        },
        status: true,
        student: true,
      },
    });
    if (!schedule) throw new ScheduleNotFoundException();

    if (schedule.monitor.student_id != userId)
      throw new NotTheScheduleMonitorException();

    const preferential_place =
      schedule.monitor?.MonitorSettings?.[0]?.preferential_place ?? '-';

    const now = new Date();
    const AMT_OFFSET = -4;
    now.setHours(now.getHours() + AMT_OFFSET);
    if (schedule.start < now) throw new OverdueScheduleException();

    if (schedule.id_status != ScheduleStatus.WAITING_APPROVAL)
      throw new InvalidScheduleStatusException(schedule.status.status);

    await this.checkConfirmedSchedules(
      schedule.monitor_id,
      schedule.start,
      schedule.end,
    );

    await this.prisma.scheduleMonitoring.update({
      data: { id_status: ScheduleStatus.CONFIRMED },
      where: { id: schedule.id },
    });

    await this.emailService.sendAcceptedScheduleEmail(
      schedule.student.contact_email,
      'Confirmado',
      schedule.monitor.student.user.name,
      schedule.start.toLocaleDateString('pt-BR'),
      schedule.start.toLocaleTimeString('pt-BR').slice(0, 5),
      schedule.end.toLocaleTimeString('pt-BR').slice(0, 5),
      preferential_place,
    );
  }

  private async checkConfirmedSchedules(
    monitorId: number,
    start: Date,
    end: Date,
  ) {
    const conflitingSchedule = await this.prisma.scheduleMonitoring.findFirst({
      where: {
        monitor_id: monitorId,
        id_status: ScheduleStatus.CONFIRMED,
        OR: [
          {
            start: {
              lte: start,
            },
            end: {
              gt: start,
            },
          },
          {
            start: {
              lt: end,
            },
            end: {
              gte: end,
            },
          },
          {
            start: {
              gte: start,
            },
            end: {
              lte: end,
            },
          },
        ],
      },
    });

    if (conflitingSchedule) throw new MonitorTimeAlreadyScheduledException();
  }
}
