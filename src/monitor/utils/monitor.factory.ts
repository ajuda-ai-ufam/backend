import { UserFactory } from 'src/user/utils/user.factory';
import { Monitor } from '../domain/monitor';

export class MonitorFactory {
  static createMonitor(prismaMonitor): Monitor {
    const subject = {
      id: prismaMonitor.subject.id,
      code: prismaMonitor.subject.code,
      name: prismaMonitor.subject.name,
      course: {
        id: prismaMonitor.subject.course.id,
        code: prismaMonitor.subject.course.code,
        name: prismaMonitor.subject.course.name,
      },
    };

    const responsible = {
      id: prismaMonitor.responsible_professor.user.id,
      name: prismaMonitor.responsible_professor.user.name,
      email: prismaMonitor.responsible_professor.user.email,
    };

    let monitorSettings = null;
    if (prismaMonitor.MonitorSettings.length) {
      monitorSettings = {
        id: prismaMonitor.MonitorSettings[0].id,
        preferentialPlace: prismaMonitor.MonitorSettings[0].preferential_place,
        isActive: prismaMonitor.MonitorSettings[0].is_active,
      };
    }

    const availability = [];
    for (const availableTime of prismaMonitor.AvailableTimes) {
      availability.push({
        id: availableTime.id,
        week_day: availableTime.week_day,
        start: availableTime.start,
        end: availableTime.end,
      });
    }

    const monitor: Monitor = {
      id: prismaMonitor.id,
      status: prismaMonitor.status.status,
      endDate: prismaMonitor.end_date,
      student: UserFactory.createStudent(prismaMonitor.student),
      subject,
      responsible,
      monitorSettings,
      availability,
    };

    return monitor;
  }
}
