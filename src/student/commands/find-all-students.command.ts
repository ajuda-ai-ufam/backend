import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';
import { QueryPaginationDto } from 'src/common/dto/query-pagination.dto';
import { IResponsePaginate } from 'src/common/interfaces/pagination.interface';
import { pagination } from 'src/common/pagination';

@Injectable()
export class FindAllStudentsCommand {
  constructor(private prisma: PrismaService) {}

  async execute(query: QueryPaginationDto) {
    const data = await this.prisma.student.findMany({
        select: {
            user: {
            select: { id: true, name: true, email: true, is_verified: true },
            },
            course: {
            select: { name: true, code: true },
            },
        },
        where: {
            OR: [
                { user: { name: { contains: query.search } } },
                { user: { email: { contains: query.search } } }
            ]
        },
    });

    return data;
  }
}
