import { BadRequestException, Injectable } from '@nestjs/common';
import { QueryPaginationDto } from 'src/common/dto/query-pagination.dto';
import { IResponsePaginate } from 'src/common/interfaces/pagination.interface';
import { pagination } from 'src/common/pagination';
import { PrismaService } from 'src/database/prisma.service';
import { SubjectService } from 'src/subject/subject.service';
import { TeacherAssingDto } from './dto/teacher-assing.dto';

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
    if (!(await this.isProfessor(body.professor_id)))
      throw new BadRequestException('Professor não encontrado.');

    if (!(await this.subjectService.findOne(body.subject_id)))
      throw new BadRequestException('Matéria não encontrada.');

    const subject_responsability =
      await this.prisma.subjectResponsability.findFirst({
        where: {
          subject_id: body.subject_id,
          professor_id: body.professor_id,
        },
      });
    if (subject_responsability)
      throw new BadRequestException('Professor já responsável pela matéria.');

    await this.prisma.subjectResponsability.create({
      data: {
        professor_id: body.professor_id,
        subject_id: body.subject_id,
      },
    });
    return { message: 'Disciplina atribuida com sucesso!' };
  }

  async isProfessor(user_id: number) {
    const isProfessor = await this.prisma.teacher.findUnique({
      where: { user_id: user_id },
    });
    return isProfessor;
  }
}
