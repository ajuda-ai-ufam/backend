import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';
import { TeacherAssingDto } from '../dto/teacher-assing.dto';
import { SubjectService } from 'src/subject/subject.service';
import { SubjectNotFoundException } from 'src/subject/utils/exceptions';
import { SubjectResponsabilityStatus } from 'src/subject/utils/subject.enum';
import {
  TeacherAlreadyResponsibleException,
  TeacherNotFoundException,
} from '../utils/exceptions';
import { EmailService } from 'src/email/email.service';

@Injectable()
export class AssignSubjectCommand {
  constructor(
    private readonly prisma: PrismaService,
    private readonly subjectService: SubjectService,
    private readonly emailService: EmailService,
  ) {}

  async execute(body: TeacherAssingDto) {
    const subject = await this.subjectService.findOne(body.subject_id);

    if (!subject) throw new SubjectNotFoundException();

    const teachers = await this.prisma.teacher.findMany({
      where: {
        user_id: { in: body.professors_ids },
      },
      include: {
        SubjectResponsability: true,
        user: true,
      },
    });

    if (!teachers) {
      throw new TeacherNotFoundException();
    }

    const isAnyTeacherAlreadyAssigned = teachers.some((teacher) =>
      teacher.SubjectResponsability.some(
        (subject) =>
          subject.subject_id === body.subject_id &&
          subject.id_status !== SubjectResponsabilityStatus.FINISHED,
      ),
    );

    if (isAnyTeacherAlreadyAssigned) {
      throw new TeacherAlreadyResponsibleException();
    }

    await this.assingSubjectToProfessor(body.subject_id, body.professors_ids);

    await this.sendEmailToTeachers(teachers, body);
  }

  /*****************************************************************************
   * Private / Supportive Methods
   */
  private async assingSubjectToProfessor(
    subject_id: number,
    professors_ids: number[],
  ) {
    await this.prisma.subjectResponsability.createMany({
      data: professors_ids.map((id) => ({
        professor_id: id,
        subject_id: subject_id,
        id_status: SubjectResponsabilityStatus.APPROVED,
      })),
    });
    return { message: `Disciplina atribuida com sucesso!` };
  }

  private async sendEmailToTeachers(
    teachers: Array<any>,
    body: TeacherAssingDto,
  ) {
    const subject = await this.prisma.subject.findUnique({
      where: { id: body.subject_id },
    });

    for (const teacher of teachers) {
      const email = teacher.user.email;
      const teacherName = teacher.user.name;
      const subjectName = `${subject.code} - ${subject.name}`;
      const subjectId = body.subject_id;

      await this.emailService.sendEmailAssignSubject(
        email,
        teacherName,
        subjectName,
        subjectId,
      );
    }
  }
}
