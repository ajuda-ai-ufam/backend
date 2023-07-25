import { Injectable } from '@nestjs/common';
import { Role } from 'src/auth/enums/role.enum';
import { PrismaService } from 'src/database/prisma.service';
import {
  ListMonitorsQueryParams,
  ListMonitorsResponse,
} from '../dto/list-monitors.request.dto';

@Injectable()
export class ListMonitorsCommand {
  constructor(private readonly prismaService: PrismaService) {}

  async execute(
    userId: number,
    userRole: Role,
    query: ListMonitorsQueryParams,
  ): Promise<ListMonitorsResponse> {
    const take = query.pageSize || 10;
    const skip = query.page && query.page > 0 ? (query.page - 1) * take : 0;
    const where = {
      responsible_professor_id:
        userRole === Role.Professor ? userId : undefined,
      id_status: query.status,
      OR: [
        {
          student: {
            user: {
              name: {
                contains: query.name,
              },
            },
          },
        },
        {
          responsible_professor: {
            user: {
              name: {
                contains: query.name,
              },
            },
          },
        },
      ],
    };

    const monitors = await this.prismaService.monitor.findMany({
      where,
      include: {
        student: {
          select: {
            user: { select: { name: true } },
            course: { select: { name: true, code: true } },
          },
        },
        subject: true,
        responsible_professor: {
          select: { user: { select: { name: true } } },
        },
        status: { select: { status: true } },
        MonitorSettings: {
          select: { id: true, preferential_place: true },
          where: { is_active: true },
        },
      },
      take,
      skip,
    });
    const totalItems = await this.prismaService.monitor.count({ where });

    return {
      data: monitors,
      meta: {
        page: query.page || 1,
        pageSize: take,
        totalItems,
        totalPages: Math.ceil(totalItems / take),
      },
    };
  }
}
