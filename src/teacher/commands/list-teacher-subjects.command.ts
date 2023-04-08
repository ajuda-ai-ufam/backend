import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';
import { Subject } from 'src/subject/domain/subject';
import { SubjectFactory } from 'src/subject/utils/subject.factory';
import { TeacherNotFoundException } from '../utils/exceptions';

@Injectable()
// TODO - Criar rota
export class ListTeacherSubjectsCommand {
  constructor(private prisma: PrismaService) {}

  async execute(teacherId: number): Promise<Subject[]> {
    const teacher = await this.prisma.teacher.findUnique({
      where: { user_id: teacherId },
      include: {
        user: true,
        SubjectResponsability: {
          include: {
            subject: {
              include: {
                course: true,
              },
            },
          },
        },
      },
    });

    if (!teacher) {
      throw new TeacherNotFoundException();
    }

    return teacher.SubjectResponsability.map((sub) =>
      SubjectFactory.createSubject(sub.subject),
    );
  }
}
