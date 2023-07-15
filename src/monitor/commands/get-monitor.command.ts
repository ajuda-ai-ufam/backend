import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';
import { Monitor } from '../domain/monitor';
import { MonitorNotFoundException } from 'src/student/utils/exceptions';
import { MonitorFactory } from '../utils/monitor.factory';

@Injectable()
export class GetMonitorCommand {
  constructor(private readonly prismaService: PrismaService) {}

  async execute(monitorId: number): Promise<Monitor> {
    const monitor = await this.prismaService.monitor.findUnique({
      where: {
        id: monitorId,
      },
      include: {
        responsible_professor: { include: { user: true } },
        student: { include: { course: true, user: true } },
        subject: { include: { course: true } },
        AvailableTimes: true,
        status: true,
        MonitorSettings: {
          select: {
            id: true,
            preferential_place: true,
            is_active: true,
          },
          where: {
            is_active: true,
          },
        },
      },
    });

    if (!monitor) {
      throw new MonitorNotFoundException();
    }

    return MonitorFactory.createMonitor(monitor);
  }
}
