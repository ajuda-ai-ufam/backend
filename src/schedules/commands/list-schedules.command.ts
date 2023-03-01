import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';
import { ListSchedulesQueryParams } from '../dto/list-schedules.request.dto';
import { ListSchedulesResponse } from '../dto/list-schedules.response.dto';

@Injectable()
export class ListSchedulesCommand {
  constructor(private prisma: PrismaService) {}

  async execute(
    query: ListSchedulesQueryParams,
  ): Promise<ListSchedulesResponse> {
    const take = query.pageSize || 10;
    const skip = query.page ? (query.page - 1) * take : 0;

    const userSelect = {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    };

    const studentSelect = {
      student: {
        select: {
          enrollment: true,
          ...userSelect,
        },
      },
    };

    const where = {
      id_status: query.status,
      start: {
        gte: query.startDate,
        lte: query.endDate,
      },
      OR: [
        {
          student: {
            enrollment: query.studentEnrollment,
          },
        },
        {
          monitor: {
            student: {
              enrollment: query.studentEnrollment,
            },
          },
        },
        {
          student: {
            user: {
              name: {
                contains: query.studentName,
              },
            },
          },
        },
        {
          monitor: {
            student: {
              user: {
                name: {
                  contains: query.studentName,
                },
              },
            },
          },
        },
      ],
      monitor: {
        responsible_professor_id: {
          in: query.responsibleIds,
        },
        subject_id: {
          in: query.subjectIds,
        },
      },
    };

    const response = await this.prisma.scheduleMonitoring.findMany({
      select: {
        id: true,
        id_status: true,
        start: true,
        end: true,
        ...studentSelect,
        monitor: {
          select: {
            id: true,
            ...studentSelect,
            subject: {
              select: {
                id: true,
                name: true,
                course: {
                  select: {
                    id: true,
                    name: true,
                  },
                },
              },
            },
            responsible_professor: {
              select: { ...userSelect },
            },
          },
        },
      },
      orderBy: {
        start: query.startDate ? 'asc' : 'desc',
      },
      where,
      skip,
      take,
    });

    const totalItems = await this.prisma.scheduleMonitoring.count({ where });

    return {
      data: response.map((resp) => ({
        id: resp.id,
        startDate: resp.start,
        endDate: resp.end,
        status: resp.id_status,
        monitor: {
          id: resp.monitor.id,
          userId: resp.monitor.student.user.id,
          enrollment: resp.monitor.student.enrollment,
          name: resp.monitor.student.user.name,
          email: resp.monitor.student.user.email,
        },
        student: {
          id: resp.student.user.id,
          enrollment: resp.student.enrollment,
          name: resp.student.user.name,
          email: resp.student.user.email,
        },
        responsibleProfessor: {
          id: resp.monitor.responsible_professor.user.id,
          name: resp.monitor.responsible_professor.user.name,
          email: resp.monitor.responsible_professor.user.email,
        },
        subject: {
          id: resp.monitor.subject.id,
          name: resp.monitor.subject.name,
          course: {
            id: resp.monitor.subject.course.id,
            name: resp.monitor.subject.course.name,
          },
        },
      })),
      meta: {
        page: query.page || 1,
        pageSize: take,
        totalItems,
        totalPages: Math.ceil(totalItems / take),
      },
    };
  }
}
