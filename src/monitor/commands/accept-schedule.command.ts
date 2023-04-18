import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';
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
  constructor(private readonly prismaService: PrismaService) {}

  async execute(userId: number, scheduleId: number): Promise<void> {
    const schedule = await this.prismaService.scheduleMonitoring.findUnique({
      where: { id: scheduleId },
      include: { monitor: true, status: true },
    });
    if (!schedule) throw new ScheduleNotFoundException();

    if (schedule.monitor.student_id != userId)
      throw new NotTheScheduleMonitorException();

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

    await this.prismaService.scheduleMonitoring.update({
      data: { id_status: ScheduleStatus.CONFIRMED },
      where: { id: schedule.id },
    });
  }

  private async checkConfirmedSchedules(
    monitorId: number,
    start: Date,
    end: Date,
  ) {
    const conflitingSchedule =
      await this.prismaService.scheduleMonitoring.findFirst({
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
