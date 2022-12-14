import { elementAt } from 'rxjs';
import { Injectable, NotFoundException } from '@nestjs/common';
import { Subject } from '@prisma/client';
import { QueryPaginationDto } from 'src/common/dto/query-pagination.dto';
import { IResponsePaginate } from 'src/common/interfaces/pagination.interface';
import { pagination } from 'src/common/pagination';
import { PrismaService } from 'src/database/prisma.service';
import { SubjectDTO } from './dto/subject.dto';

@Injectable()
export class SubjectService {
  constructor(private readonly prisma: PrismaService) {}

  async listSubjects(
    query: QueryPaginationDto,
    subject: SubjectDTO,
  ): Promise<IResponsePaginate> {
    console.log(subject);
    const id = Number(subject.id);

    const selecUserData = {
      select: {
        user: { select: { id: true, name: true, email: true } },
      },
    };

    const data = await this.prisma.subject.findFirst({
      where: { id },
      include: {
        SubjectResponsability: {
          select: {
            professor: selecUserData,
            status: { select: { id: true, status: true } },
          },
        },
        Monitor: {
          select: {
            student: {
              select: {
                user: selecUserData.select.user,
                course: {
                  select: { id: true, name: true },
                },
              },
            },
            status: { select: { id: true, status: true } },
          },
        },
      },
    });

    if (!data) throw new NotFoundException('Disciplina não encontrada.');

    // const filterlist = [];
    // filtro acima e abaixo
    // if (subject?.filter) {
    //   data.SubjectResponsability.forEach((element) => {
    //     if (element.status.id == filter) filterlist.push(element);
    //   });
    //   data.SubjectResponsability = filterlist;
    // }

    return pagination([data], query);
  }

  async findOne(id: number): Promise<Subject> {
    const selecUserData = {
      select: {
        user: { select: { id: true, name: true, email: true } },
      },
    };

    const data = await this.prisma.subject.findFirst({
      where: { id },
      include: {
        SubjectResponsability: {
          select: {
            professor: selecUserData,
            status: { select: { id: true, status: true } },
          },
        },
        Monitor: {
          select: {
            responsible_professor: selecUserData,
            student: {
              select: {
                user: selecUserData.select.user,
                course: {
                  select: { id: true, name: true },
                },
              },
            },
          },
        },
      },
    });

    if (!data) throw new NotFoundException('Disciplina não encontrada.');

    return data;
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
