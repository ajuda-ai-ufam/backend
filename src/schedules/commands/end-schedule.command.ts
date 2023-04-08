import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';
import {
  InvalidScheduleStatusException,
  NotFinalizedScheduleException,
  NotTheScheduleMonitorException,
  ScheduleNotFoundException,
} from '../utils/exceptions';
import { ScheduleStatus } from '../utils/schedules.enum';

@Injectable()
export class EndScheduleCommand {
  constructor(private prisma: PrismaService) {}

  async execute(
    scheduleId: number,
    userId: number,
    wasRealized: boolean,
  ): Promise<void> {
    const where = { id: scheduleId };

    const schedule = await this.prisma.scheduleMonitoring.findUnique({
      where,
      include: { monitor: true, status: true },
    });
    if (!schedule) {
      throw new ScheduleNotFoundException();
    }

    if (schedule.monitor.student_id !== userId) {
      throw new NotTheScheduleMonitorException();
    }

    if (schedule.id_status !== ScheduleStatus.CONFIRMED) {
      throw new InvalidScheduleStatusException(schedule.status.status);
    }

    if (schedule.end > new Date()) {
      throw new NotFinalizedScheduleException(schedule.end);
    }

    const newStatus = wasRealized
      ? ScheduleStatus.REALIZED
      : ScheduleStatus.NOT_REALIZED;
    await this.prisma.scheduleMonitoring.update({
      data: { id_status: newStatus },
      where,
    });
  }
}
