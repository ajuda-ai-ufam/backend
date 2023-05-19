import { Injectable, NotFoundException } from '@nestjs/common';
import { pagination } from 'src/common/pagination';
import { PrismaService } from 'src/database/prisma.service';
import { MonitorStatus } from 'src/monitor/utils/monitor.enum';
import { SchedulesDto } from '../dto/schedules.dto';

@Injectable()
export class ListStudentSchedulesCommand {
  constructor(private prisma: PrismaService) {}

  async execute(userId: number, query: SchedulesDto): Promise<any> {
    const studentInclude = {
      include: {
        course: true,
        user: {
          select: { name: true },
        },
      },
    };

    const monitorings = await this.prisma.monitor.findMany({
      where: {
        student_id: userId,
        id_status: { in: [MonitorStatus.AVAILABLE, MonitorStatus.DONE] },
      },
      include: {
        student: studentInclude,
      },
    });

    let orStatement = [
      { student_id: userId },
      { monitor_id: { in: monitorings.map((monitor) => monitor.id) } },
    ];
    if (query.eventType === 'student') {
      orStatement = [orStatement[0]];
    } else if (query.eventType === 'monitor') {
      orStatement = [orStatement[1]];
    }

    const today = new Date();
    const AMT_OFFSET = -4;
    today.setHours(today.getHours() + AMT_OFFSET);
    today.setHours(0, 0, 0, 0);

    const schedules = await this.prisma.scheduleMonitoring.findMany({
      where: {
        OR: orStatement,
        id_status: Number(query.status) || undefined,
        start: { gte: today.toISOString() },
      },
      include: {
        monitor: { include: { student: studentInclude, subject: true } },
        student: studentInclude,
      },
      orderBy: {
        start: 'asc',
      },
    });

    if (!schedules) {
      throw new NotFoundException('Agendamentos nao encontrados.');
    }

    schedules.forEach((schedule) => {
      if (schedule.monitor.student_id === userId)
        schedule['is_monitoring'] = true;
      else schedule['is_monitoring'] = false;
    });

    return pagination(schedules, query);
  }
}
