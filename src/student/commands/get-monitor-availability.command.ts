import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';

@Injectable()
export class GetMonitorAvailabilityCommand {
  constructor(private prisma: PrismaService) {}

  /**
   * TODO: resolve Promise<any> return type
   */
  async execute(monitor_id: number): Promise<any> {
    return this.prisma.availableTimes.findMany({
      where: { monitor_id },
      orderBy: { week_day: 'asc' },
    });
  }
}
