import { Injectable } from '@nestjs/common';
import { Subject } from '@prisma/client';
import { QueryPaginationDto } from 'src/common/dto/query-pagination.dto';
import { IResponsePaginate } from 'src/common/interfaces/pagination.interface';
import { pagination } from 'src/common/pagination';
import { PrismaService } from 'src/database/prisma.service';

@Injectable()
export class SubjectService {
  constructor(private readonly prisma: PrismaService) {}

  async findOne(id: number): Promise<Subject> {
    return await this.prisma.subject.findUnique({
      where: { id },
      include: {
        SubjectResponsability: true,
        Monitor: true,
      },
    });
  }

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
