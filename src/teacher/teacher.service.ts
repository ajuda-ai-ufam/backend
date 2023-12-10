import { Injectable } from '@nestjs/common';
import { QueryPaginationDto } from 'src/common/dto/query-pagination.dto';
import { IResponsePaginate } from 'src/common/interfaces/pagination.interface';
import { pagination } from 'src/common/pagination';
import { PrismaService } from 'src/database/prisma.service';
import { ListTeachersQueryParams } from './dto/list-teacher.request.dto';

@Injectable()
export class TeacherService {
  constructor(private prisma: PrismaService) {}

  async create(user_id: number, siape: string, departament_id: number) {
    const user_teacher = await this.prisma.teacher.create({
      data: { user_id: user_id, siape: siape, department_id: departament_id },
    });
    return user_teacher;
  }

  async findAll(query: ListTeachersQueryParams): Promise<IResponsePaginate> {
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

    const data = await this.prisma.teacher.findMany({
      select: {
        siape: true,
        department: { select: { id: true, name: true } },
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            is_verified: true,
          },
        },
        SubjectResponsability: {
          select: {
            status: true,
            subject: { select: { name: true, code: true } },
          },
        },
        ...(query.includeMonitors && {
          Monitor: {
            select: {
              id: true,
              ...studentSelect,
            },
            where: {
              OR: [
                { student: { user: { name: { contains: query.monitor } } } },
                { student: { enrollment: { contains: query.monitor } } },
              ],
            },
          },
        }),
      },
      where: {
        OR: [
          { user: { name: { contains: query.search } } },
          { user: { email: { contains: query.search } } },
          { siape: { contains: query.search } },
        ],
        department_id: { in: query.departmentIds },
        SubjectResponsability: {
          some: { subject: { code: { in: query.subjectIds } } },
        },
      },
    });
    return pagination(data, query);
  }
}
