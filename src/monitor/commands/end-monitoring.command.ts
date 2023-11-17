import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';
import { MonitorStatus } from '../utils/monitor.enum';
import {
  InvalidMonitoringStatusException,
  MonitoringNotFoundException,
  NotTheResponsibleProfessorException,
} from '../utils/exceptions';
import { RefuseScheduledMonitoringCommand } from './refuse-scheduled-monitoring.command';
import { Role } from 'src/auth/enums/role.enum';
import { ScheduleStatus } from 'src/schedules/utils/schedules.enum';

@Injectable()
export class EndMonitoringCommand {
  constructor(
    private prisma: PrismaService,
    private readonly refuseScheduledMonitoringCommand: RefuseScheduledMonitoringCommand,
  ) {}

  async execute(
    monitorId: number,
    userId: number,
    userRole: string,
  ): Promise<void> {
    const AMT_OFFSET_IN_MS = -4 * 60 * 60 * 1000;
    const now = new Date();
    const nowAMT = new Date(now.getTime() + AMT_OFFSET_IN_MS).toISOString();

    const monitoring = await this.prisma.monitor.findUnique({
      include: {
        status: true,
      },
      where: { id: monitorId },
    });

    if (!monitoring) {
      throw new MonitoringNotFoundException();
    }

    if (
      userRole !== Role.Coordinator &&
      userRole !== Role.SuperCoordinator &&
      userId !== monitoring.responsible_professor_id
    ) {
      throw new NotTheResponsibleProfessorException();
    }

    if (
      monitoring.id_status === MonitorStatus.PENDING ||
      monitoring.id_status === MonitorStatus.REJECTED ||
      monitoring.id_status === MonitorStatus.DONE
    ) {
      throw new InvalidMonitoringStatusException(monitoring.status.status);
    }

    const schedules = await this.prisma.scheduleMonitoring.findMany({
      where: {
        monitor_id: monitorId,
        id_status: ScheduleStatus.WAITING_APPROVAL,
      },
    });

    schedules.forEach(async (schedule) => {
      await this.refuseScheduledMonitoringCommand.execute(
        schedule.id,
        monitoring.student_id,
      );
    });

    await this.prisma.monitor.update({
      where: { id: monitorId },
      data: { id_status: MonitorStatus.DONE, end_date: nowAMT },
    });
  }
}
