import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';
import { ListEndingSchedulesResponse } from '../dto/list-ending-schedules.response.dto';
import { ScheduleFactory } from '../utils/schedule.factory';
import { ScheduleStatus } from '../utils/schedules.enum';
import scheduleSelectPrismaSQL from '../utils/select-schedule.prisma-sql';

@Injectable()
export class ListEndingSchedulesCommand {
  constructor(private prisma: PrismaService) {}

  async execute(monitorUserId: number): Promise<ListEndingSchedulesResponse> {
    const where = {
      id_status: ScheduleStatus.CONFIRMED,
      end: {
        lte: new Date(),
      },
      monitor: {
        student: {
          user: {
            id: monitorUserId,
          },
        },
      },
    };

    const response = await this.prisma.scheduleMonitoring.findMany({
      select: scheduleSelectPrismaSQL,
      orderBy: {
        end: 'asc',
      },
      where,
    });

    return {
      data: response.map((resp) => ScheduleFactory.createFromPrisma(resp)),
    };
  }
}
