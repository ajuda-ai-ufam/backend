import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';
import {
  StudentNotEnrolledException,
  SubjectNotFoundException,
} from '../utils/exceptions';

@Injectable()
export class CancelSubjectEnrollmentCommand {
  constructor(private readonly prisma: PrismaService) {}

  async execute(subjectId: number, studentId: number): Promise<void> {
    const subject = await this.prisma.subject.findFirst({
      where: { id: subjectId },
    });
    if (!subject) {
      throw new SubjectNotFoundException();
    }

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
