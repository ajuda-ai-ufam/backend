import { Injectable, NotFoundException } from '@nestjs/common';
import { Subject } from '@prisma/client';
import { QueryPaginationDto } from 'src/common/dto/query-pagination.dto';
import { IResponsePaginate } from 'src/common/interfaces/pagination.interface';
import { pagination } from 'src/common/pagination';
import { PrismaService } from 'src/database/prisma.service';

@Injectable()
export class SubjectService {
  constructor(private readonly prisma: PrismaService) {}

  async listSubjects(id: number) {
    const selecUserData = {
      select: {
        user: { select: { id: true, name: true, email: true } },
      },
    };

    const data = await this.prisma.subject.findFirst({
      where: { id: id },
      include: {
        SubjectResponsability: {
          select: {
            id: true,
            professor: selecUserData,
            status: { select: { id: true, status: true } },
          },
        },
        Monitor: {
          select: {
            id: true,
            student: {
              select: {
                user: selecUserData.select.user,
                course: {
                  select: { id: true, name: true },
                },
              },
            },
            status: { select: { id: true, status: true } },
            responsible_professor: {
              select: { user: selecUserData.select.user },
            },
          },
        },
      },
    });

    const approved_SubjectResponsability = [];
    const approved_Monitores = [];
    if (!data) throw new NotFoundException('Disciplina não encontrada.');

    //somente professores aprovados
    data.SubjectResponsability.forEach((element) => {
      if (element.status.id == 2) approved_SubjectResponsability.push(element);
    });

    //somente monitores disponíveis
    data.Monitor.forEach((element) => {
      if (element.status.id == 3 || element.status.id == 2)
        approved_Monitores.push(element);
    });

    data.SubjectResponsability = approved_SubjectResponsability;
    data.Monitor = approved_Monitores;

    return data;
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
            id: true,
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
    const selecUserData = {
      select: {
        user: { select: { id: true, name: true, email: true } },
      },
    };

    const data = await this.prisma.subject.findMany({
      where: {
        name: {
          contains: query.search,
        },
      },
      include: {
        SubjectResponsability: {
          select: {
            id: true,
            professor: selecUserData,
            status: { select: { id: true, status: true } },
          },
        },
        Monitor: {
          select: {
            id: true,
            student: {
              select: {
                user: selecUserData.select.user,
                course: {
                  select: { id: true, name: true },
                },
              },
            },
            status: { select: { id: true, status: true } },
            responsible_professor: {
              select: { user: selecUserData.select.user },
            },
          },
          where: {
            id_status: 3,
          },
        },
      },
    });
    return pagination(data, query);
  }
}
