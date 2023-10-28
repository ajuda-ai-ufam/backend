import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';
import { SubjectService } from '../subject.service';
import { StudentAlreadyEnrolledException } from '../utils/exceptions';
import { Enrollment } from '../dto/enrollment.dto';

@Injectable()
export class CreateSubjectEnrollmentCommand {
  constructor(
    private readonly prisma: PrismaService,
    private readonly subjectService: SubjectService,
  ) {}

  async execute(subjectId: number, studentId: number): Promise<Enrollment> {
    const enrollment = await this.prisma.subjectEnrollment.findFirst({
      where: {
        student_id: studentId,
        subject_id: subjectId,
        canceled_at: null,
      },
    });

    if (enrollment) {
      throw new StudentAlreadyEnrolledException();
    }

    const subjectEnrollment = {
      student_id: studentId,
      subject_id: subjectId,
    };

    return await this.prisma.subjectEnrollment.create({
      data: subjectEnrollment,
    });
  }
}
