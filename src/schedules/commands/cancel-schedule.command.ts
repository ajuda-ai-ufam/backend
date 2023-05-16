import { ScheduleMonitoring, User } from '.prisma/client';
import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';
import { EmailService } from 'src/email/email.service';
import {
  InvalidScheduleStatusException,
  NotTheScheduleParticipantException,
  ScheduleNotFoundException,
} from '../utils/exceptions';
import { ScheduleStatus } from '../utils/schedules.enum';

@Injectable()
export class CancelScheduleCommand {
  constructor(
    private prisma: PrismaService,
    private emailService: EmailService,
  ) {}

  async execute(scheduleId: number, userId: number): Promise<void> {
    const where = { id: scheduleId };

    const schedule = await this.prisma.scheduleMonitoring.findUnique({
      where,
      include: {
        monitor: { include: { student: { include: { user: true } } } },
        status: true,
        student: { include: { user: true } },
      },
    });

    if (!schedule) {
      throw new ScheduleNotFoundException();
    }

    let recipientUser;
    let senderUser;
    if (schedule.monitor.student_id === userId) {
      recipientUser = schedule.student.user;
      senderUser = schedule.monitor.student.user;
    } else {
      if (schedule.student_id === userId) {
        recipientUser = schedule.monitor.student.user;
        senderUser = schedule.student.user;
      } else {
        throw new NotTheScheduleParticipantException();
      }
    }

    if (schedule.id_status !== ScheduleStatus.CONFIRMED) {
      throw new InvalidScheduleStatusException(schedule.status.status);
    }

    const newStatus = ScheduleStatus.CANCELED;
    await this.prisma.scheduleMonitoring.update({
      data: { id_status: newStatus },
      where,
    });

    // send emails
    this.sendSenderEmail(senderUser, recipientUser, schedule);
    this.sendRecipientEmail(recipientUser, senderUser, schedule);
  }

  async sendSenderEmail(
    user: User,
    recipient: User,
    schedule: ScheduleMonitoring,
  ) {
    const email: string = user.email;
    const sub: string = process.env.CANCEL_MONITORING_SENDER;
    const context = {
      name: recipient.name,
      date: schedule.start.toLocaleDateString('pt-BR'),
      start: schedule.start.toLocaleTimeString('pt-BR').slice(0, 5),
      end: schedule.end.toLocaleTimeString('pt-BR').slice(0, 5),
    };
    const template = 'schedule_cancel_sender_confirmation';
    await this.emailService.sendEmailCancelMonitoring(
      email,
      sub,
      context,
      template,
    );
  }

  async sendRecipientEmail(
    user: User,
    sender: User,
    schedule: ScheduleMonitoring,
  ) {
    const email: string = user.email;
    const sub: string = process.env.CANCEL_MONITORING_RECIPIENT;
    const context = {
      name: sender.name,
      date: schedule.start.toLocaleDateString('pt-BR'),
      start: schedule.start.toLocaleTimeString('pt-BR').slice(0, 5),
      end: schedule.end.toLocaleTimeString('pt-BR').slice(0, 5),
    };
    const template = 'schedule_cancel_recipient_confirmation';

    await this.emailService.sendEmailCancelMonitoring(
      email,
      sub,
      context,
      template,
    );
  }
}
