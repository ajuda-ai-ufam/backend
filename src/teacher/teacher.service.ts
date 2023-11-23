import { Injectable } from '@nestjs/common';
import { QueryPaginationDto } from 'src/common/dto/query-pagination.dto';
import { IResponsePaginate } from 'src/common/interfaces/pagination.interface';
import { pagination } from 'src/common/pagination';
import { PrismaService } from 'src/database/prisma.service';

@Injectable()
export class TeacherService {
  constructor(private prisma: PrismaService) {}

  async create(user_id: number, siape: string) {
    const user_teacher = await this.prisma.teacher.create({
      data: { user_id: user_id, siape: siape },
    });
    return user_teacher;
  }

  async findAll(query: QueryPaginationDto): Promise<IResponsePaginate> {
    const data = await this.prisma.teacher.findMany({
      select: {
        user: {
          select: { id: true, name: true, email: true, is_verified: true },
        },
        SubjectResponsability: {
          select: {
            status: true,
            subject: { select: { name: true, code: true } },
          },
        },
      },
      where: {
        user: {
          name: { contains: query.search },
        },
        OR: {
          user: { email: { contains: query.search } },
        },
      },
    });
    return pagination(data, query);
  }
}
