import { Injectable } from '@nestjs/common';
import { Role } from 'src/auth/enums/role.enum';
import { PrismaService } from 'src/database/prisma.service';
import { ListSchedulesQueryParams } from '../dto/list-schedules.request.dto';
import { ListSchedulesResponse } from '../dto/list-schedules.response.dto';
import { ProfessorNotAuthorizedException } from '../utils/exceptions';
import { ScheduleFactory } from '../utils/schedule.factory';
import scheduleSelectPrismaSQL from '../utils/select-schedule.prisma-sql';

@Injectable()
export class ListSchedulesCommand {
  constructor(private prisma: PrismaService) {}

  async execute(
    query: ListSchedulesQueryParams,
    userId: number,
    userRole: Role,
  ): Promise<ListSchedulesResponse> {
    const responsibleIds = query.responsibleIds || [];
    if (userRole === Role.Professor) {
      if (responsibleIds.length) {
        throw new ProfessorNotAuthorizedException();
      }

      responsibleIds.push(userId);
    }

    const take = query.pageSize || 10;
    const skip = query.page ? (query.page - 1) * take : 0;

    const where = {
      id_status: query.status,
      start: {
        gte: query.startDate,
        lte: query.endDate,
      },
      AND: [
        {
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
          ],
        },
        {
          OR: [
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
        },
      ],
      monitor: {
        responsible_professor_id: {
          in: responsibleIds.length ? responsibleIds : undefined,
        },
        subject_id: {
          in: query.subjectIds,
        },
      },
    };

    const response = await this.prisma.scheduleMonitoring.findMany({
      select: scheduleSelectPrismaSQL,
      orderBy: {
        start: query.startDate ? 'asc' : 'desc',
      },
      where,
      skip,
      take,
    });

    const totalItems = await this.prisma.scheduleMonitoring.count({ where });

    return {
      data: response.map((resp) => ScheduleFactory.createFromPrisma(resp)),
      meta: {
        page: query.page || 1,
        pageSize: take,
        totalItems,
        totalPages: Math.ceil(totalItems / take),
      },
    };
  }
}
