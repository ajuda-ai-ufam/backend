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

  async execute(schedule_id: number, user_id: number): Promise<any> {
    const schedule = await this.prismaService.scheduleMonitoring.findUnique({
      where: { id: schedule_id },
      include: { monitor: true, student: true },
    });
    if (!schedule) {
      throw new ScheduledMonitoringNotFoundException();
    }

    if (schedule.id_status != ScheduleStatus.WAITING_APPROVAL) {
      throw new ScheduleNotPendingException();
    }

    if (schedule.monitor.student_id != user_id) {
      throw new NotTheScheduleMonitorException();
    }

    await this.prismaService.scheduleMonitoring.update({
      data: { id_status: ScheduleStatus.CANCELED },
      where: { id: schedule_id },
    });

    const email = schedule.student.contact_email;

    await this.emailService.sendEmailRefuseScheduledMonitoring(email);

    return { message: 'Agendamento rejeitado!' };
  }
}
