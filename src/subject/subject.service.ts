import { Injectable } from '@nestjs/common';
import { QueryPaginationDto } from 'src/common/dto/query-pagination.dto';
import { IResponsePaginate } from 'src/common/interfaces/pagination';
import { pagination } from 'src/common/pagination';
import { PrismaService } from 'src/database/prisma.service';

@Injectable()
export class SubjectService {
  constructor(private prisma: PrismaService) {}

  async findAll(query: QueryPaginationDto): Promise<IResponsePaginate> {
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
