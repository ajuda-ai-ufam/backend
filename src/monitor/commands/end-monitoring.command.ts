import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';
import { MonitorStatus } from '../utils/monitor.enum';
import {
  InvalidMonitoringStatusException,
  MonitoringNotFoundException,
  NotTheResponsibleProfessorException,
} from '../utils/exceptions';
import { Role } from 'src/auth/enums/role.enum';

@Injectable()
export class EndMonitoringCommand {
  constructor(private prisma: PrismaService) {}

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

    await this.prisma.monitor.update({
      where: { id: monitorId },
      data: { id_status: MonitorStatus.DONE, end_date: nowAMT },
    });
  }
}
