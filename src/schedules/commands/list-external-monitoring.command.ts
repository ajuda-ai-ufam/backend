import { Injectable } from "@nestjs/common";
import { PrismaService } from 'src/database/prisma.service';
import { ListSchedulesQueryParams } from "../dto/list-schedules.request.dto";
import { Role } from "src/auth/enums/role.enum";
import { ListSchedulesResponse } from '../dto/list-schedules.response.dto';
import { ProfessorNotAuthorizedException } from "../utils/exceptions";
import { ScheduleFactory } from "../utils/schedule.factory";
import scheduleSelectExternalPrismaSQL from "../utils/select-schedule-external.prisma.sql";


@Injectable()
export class ListExternalMonitoringCommand {
  constructor(private prisma: PrismaService) {}

  async execute(
    query: ListSchedulesQueryParams,
    userId: number,
    userRole: Role,
  ): Promise<any> {
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
      start: {
        gte: query.startDate,
        lte: query.endDate,
      },
        OR: [
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
          in: responsibleIds.length ? responsibleIds : undefined,
        },
        subject_id: {
          in: query.subjectIds,
        },
      },
    };

    const new_external = await this.prisma.externalMonitoring.findMany({
        select: scheduleSelectExternalPrismaSQL,
        orderBy: {
            start: query.startDate ? 'asc' : 'desc',
          },
          where,
          skip,
          take,
    });

    const totalItems = await this.prisma.externalMonitoring.count({ where });

    return {
      data: new_external.map((resp) => ScheduleFactory.createFromPrisma(resp)),
      meta: {
        page: query.page || 1,
        pageSize: take,
        totalItems,
        totalPages: Math.ceil(totalItems / take),
      },
    };
  }
}
