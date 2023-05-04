import { Schedule } from '../domain/schedule';

export class ScheduleFactory {
  static createFromPrisma(prismaSchedule): Schedule {
    const schedule: Schedule = {
      id: prismaSchedule.id,
      startDate: prismaSchedule.start,
      endDate: prismaSchedule.end,
      status: prismaSchedule.id_status,
    };

    if (!!prismaSchedule.monitor) {
      schedule.monitor = {
        id: prismaSchedule.monitor.id,
        userId: prismaSchedule.monitor.student.user.id,
        enrollment: prismaSchedule.monitor.student.enrollment,
        name: prismaSchedule.monitor.student.user.name,
        email: prismaSchedule.monitor.student.user.email,
      };

      if (!!prismaSchedule.monitor.responsible_professor) {
        schedule.responsibleProfessor = {
          id: prismaSchedule.monitor.responsible_professor.user.id,
          name: prismaSchedule.monitor.responsible_professor.user.name,
          email: prismaSchedule.monitor.responsible_professor.user.email,
        };
      }

      if (!!prismaSchedule.monitor.subject) {
        schedule.subject = {
          id: prismaSchedule.monitor.subject.id,
          name: prismaSchedule.monitor.subject.name,
        };

        if (!!prismaSchedule.monitor.subject.course) {
          schedule.subject.course = {
            id: prismaSchedule.monitor.subject.course.id,
            name: prismaSchedule.monitor.subject.course.name,
          };
        }
      }
    }

    if (!!prismaSchedule.student) {
      schedule.student = {
        id: prismaSchedule.student.user.id,
        enrollment: prismaSchedule.student.enrollment,
        name: prismaSchedule.student.user.name,
        email: prismaSchedule.student.user.email,
      };
    }

    return schedule;
  }
}
