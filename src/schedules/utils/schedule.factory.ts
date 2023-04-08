import { Schedule } from '../domain/schedule';

export class ScheduleFactory {
  static createFromPrisma(prismaSchedule): Schedule {
    return {
      id: prismaSchedule.id,
      startDate: prismaSchedule.start,
      endDate: prismaSchedule.end,
      status: prismaSchedule.id_status,
      monitor: {
        id: prismaSchedule.monitor.id,
        userId: prismaSchedule.monitor.student.user.id,
        enrollment: prismaSchedule.monitor.student.enrollment,
        name: prismaSchedule.monitor.student.user.name,
        email: prismaSchedule.monitor.student.user.email,
      },
      student: {
        id: prismaSchedule.student.user.id,
        enrollment: prismaSchedule.student.enrollment,
        name: prismaSchedule.student.user.name,
        email: prismaSchedule.student.user.email,
      },
      responsibleProfessor: {
        id: prismaSchedule.monitor.responsible_professor.user.id,
        name: prismaSchedule.monitor.responsible_professor.user.name,
        email: prismaSchedule.monitor.responsible_professor.user.email,
      },
      subject: {
        id: prismaSchedule.monitor.subject.id,
        name: prismaSchedule.monitor.subject.name,
        course: {
          id: prismaSchedule.monitor.subject.course.id,
          name: prismaSchedule.monitor.subject.course.name,
        },
      },
    };
  }
}
