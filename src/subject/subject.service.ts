import { Injectable, NotFoundException } from '@nestjs/common';
import { Subject } from '@prisma/client';
import { SubjectQueryDto } from './dto/subject-query.dto';
import { IResponsePaginate } from 'src/common/interfaces/pagination.interface';
import { pagination } from 'src/common/pagination';
import { PrismaService } from 'src/database/prisma.service';
import { MonitorStatus } from 'src/monitor/utils/monitor.enum';

@Injectable()
export class SubjectService {
  constructor(private readonly prisma: PrismaService) {}

  async findSubjectById(id: number) {
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
                linkedin: true,
                contact_email: true,
                whatsapp: true,
                course: {
                  select: { id: true, name: true },
                },
              },
            },
            status: { select: { id: true, status: true } },
            responsible_professor: {
              select: { user: selecUserData.select.user },
            },
            MonitorSettings: {
              select: { id: true, preferential_place: true },
              where: { is_active: true },
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
            MonitorSettings: {
              select: { id: true, preferential_place: true },
              where: { is_active: true },
            },
          },
        },
      },
    });

    if (!data) throw new NotFoundException('Disciplina não encontrada.');

    return data;
  }

  async findAll(query: SubjectQueryDto): Promise<IResponsePaginate> {
    const selecUserData = {
      select: {
        user: {
          select: { id: true, name: true, email: true },
        },
      },
    };

    console.log(query.monitorStatus);

    const teacherId =
      typeof query.teacherId === 'string'
        ? Number.parseInt(query.teacherId)
        : null;

    if (teacherId !== null) {
      const teacherExists = await this.prisma.teacher.findUnique({
        where: { user_id: teacherId },
      });

      if (!teacherExists) {
        throw new NotFoundException('Professor não encontrado.');
      }
    }

    const monitorStatus =
      typeof query.monitorStatus === 'undefined' ? null : query.monitorStatus;

    const monitorStatusFilter =
      monitorStatus !== null
        ? {
            id_status: {
              in: [...monitorStatus],
            },
          }
        : {
            id_status: {
              in: [MonitorStatus.AVAILABLE, MonitorStatus.APPROVED],
            },
          };

    const where = {
      name: {
        contains: query.search,
      },
      SubjectResponsability:
        teacherId !== null
          ? {
              some: {
                professor_id: {
                  equals: teacherId,
                },
              },
            }
          : undefined,
    };

    const data = await this.prisma.subject.findMany({
      where: where,
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
                enrollment: true,
                course: {
                  select: { id: true, name: true },
                },
              },
            },
            status: { select: { id: true, status: true } },
            responsible_professor: {
              select: { user: selecUserData.select.user },
            },
            MonitorSettings: {
              select: { id: true, preferential_place: true },
              where: { is_active: true },
            },
          },
          where: monitorStatusFilter,
        },
      },
      orderBy: { name: 'asc' },
    });

    return pagination(data, query);
  }
}
