import { BadRequestException, Injectable } from '@nestjs/common';
import { QueryPaginationDto } from 'src/common/dto/query-pagination.dto';
import { IResponsePaginate } from 'src/common/interfaces/pagination.interface';
import { pagination } from 'src/common/pagination';
import { PrismaService } from 'src/database/prisma.service';
import { SubjectService } from 'src/subject/subject.service';
import { TeacherAssingDto } from './dto/teacher-assing.dto';
import { SubjectResponsabilityStatus } from 'src/subject/utils/subject.enum';

@Injectable()
export class TeacherService {
  constructor(
    private prisma: PrismaService,
    private subjectService: SubjectService,
  ) {}

  async create(user_id: number) {
    const user_teacher = await this.prisma.teacher.create({
      data: { user_id: user_id },
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

  async assignSubject(body: TeacherAssingDto) {
    if (!(await this.subjectService.findOne(body.subject_id)))
      throw new BadRequestException('Matéria não encontrada.');

    for (const professor_id of body.professors_ids) {
      if (!(await this.isProfessor(professor_id)))
        throw new BadRequestException('Professor não encontrado.');
      const subject_responsability =
        await this.prisma.subjectResponsability.findFirst({
          where: {
            subject_id: body.subject_id,
            professor_id: professor_id,
            id_status: { not: SubjectResponsabilityStatus.FINISHED }
          },
        });
      if (subject_responsability)
        throw new BadRequestException('Professor já responsável pela matéria.');
    }
    return await this.assingSubjectToProfessor(
      body.subject_id,
      body.professors_ids,
    );
  }

  async assingSubjectToProfessor(subject_id: number, professors_ids: number[]) {
    for (const professor_id of professors_ids) {
      await this.prisma.subjectResponsability.create({
        data: {
          professor_id: professor_id,
          subject_id: subject_id,
          id_status: 2,
        },
      });
    }
    return { message: `Disciplina atribuida com sucesso!` };
  }

  async isProfessor(user_id: number) {
    const isProfessor = await this.prisma.teacher.findUnique({
      where: { user_id: user_id },
    });
    return isProfessor;
  }
}
