import { Injectable } from '@nestjs/common';
import { QueryPaginationDto } from 'src/common/dto/query-pagination.dto';
import { pagination, ResponsePagination } from 'src/common/pagination';
import { PrismaService } from 'src/database/prisma.service';

@Injectable()
export class SubjectService {
  constructor(private prisma: PrismaService) {}

  async findAll(query: QueryPaginationDto): Promise<ResponsePagination> {
    const data = await this.prisma.subject.findMany({
      where: {
        name: {
          contains: query.search,
        },
      },
    });
    return pagination(data, query);
  }
}
