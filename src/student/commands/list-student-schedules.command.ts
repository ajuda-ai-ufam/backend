import { Injectable, NotFoundException } from '@nestjs/common';
import { pagination } from 'src/common/pagination';
import { PrismaService } from 'src/database/prisma.service';
import { MonitorStatus } from 'src/monitor/utils/monitor.enum';
import { SchedulesDto } from '../dto/schedules.dto';

@Injectable()
export class ListStudentSchedulesCommand {
  constructor(private prisma: PrismaService) {}

  async execute(user_id: number, query: SchedulesDto): Promise<any> {
    const studentInclude = {
      include: {
        course: true,
        user: {
          select: { name: true },
        },
      },
    };

    const monitor = await this.prisma.monitor.findFirst({
      where: {
        student_id: user_id,
        id_status: MonitorStatus.AVAILABLE,
      },
      include: {
        student: studentInclude,
      },
    });

    let orStatement = [{ student_id: user_id }, { monitor_id: monitor?.id }];
    if (query.eventType === 'monitor') {
      orStatement = [{ monitor_id: monitor?.id }];
    } else if (query.eventType === 'student') {
      orStatement = [{ student_id: user_id }];
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

    if (!schedules)
      throw new NotFoundException('Agendamentos nao encontrados.');

    schedules.forEach((element) => {
      if (element.monitor_id == monitor?.id) element['is_monitoring'] = true;
      else element['is_monitoring'] = false;
    });

    return pagination(schedules, query);
  }
}
