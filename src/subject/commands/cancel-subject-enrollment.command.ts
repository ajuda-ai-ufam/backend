import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';
import { SubjectService } from '../subject.service';
import { StudentNotEnrolledException } from '../utils/exceptions';

@Injectable()
export class CancelSubjectEnrollmentCommand {
  constructor(
    private readonly prisma: PrismaService,
    private readonly subjectService: SubjectService,
  ) {}

  async execute(subjectId: number, studentId: number): Promise<void> {
    const enrollment = await this.prisma.subjectEnrollment.findFirst({
      where: {
        student_id: studentId,
        subject_id: subjectId,
        canceled_at: null,
      },
    });

    if (!enrollment) {
      throw new StudentNotEnrolledException();
    }

    await this.prisma.subjectEnrollment.update({
      data: { canceled_at: new Date() },
      where: { id: enrollment.id },
    });
  }
}
