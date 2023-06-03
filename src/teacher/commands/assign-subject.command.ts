import { PrismaService } from 'src/database/prisma.service';
import { TeacherAssingDto } from '../dto/teacher-assing.dto';
import { SubjectService } from 'src/subject/subject.service';
import { SubjectNotFoundException } from 'src/subject/utils/exceptions';
import { SubjectResponsabilityStatus } from 'src/subject/utils/subject.enum';
import {
  TeacherAlreadyResponsibleException,
  TeacherNotFoundException,
} from '../utils/exceptions';

export class AssignSubjectCommand {
  constructor(
    private readonly prisma: PrismaService,
    private readonly subjectService: SubjectService,
  ) {}

  async execute(body: TeacherAssingDto) {
    if (!(await this.subjectService.findOne(body.subject_id)))
      throw new SubjectNotFoundException();

    for (const professor_id of body.professors_ids) {
      if (!(await this.isProfessor(professor_id)))
        throw new TeacherNotFoundException();

      const subject_responsability =
        await this.prisma.subjectResponsability.findFirst({
          where: {
            subject_id: body.subject_id,
            professor_id: professor_id,
            id_status: { not: SubjectResponsabilityStatus.FINISHED },
          },
        });
      if (subject_responsability)
        throw new TeacherAlreadyResponsibleException();
    }

    await this.assingSubjectToProfessor(body.subject_id, body.professors_ids);

  }

  /***************************************************************************************
   * Private / Supportive Methods
   */
  private async assingSubjectToProfessor(
    subject_id: number,
    professors_ids: number[],
  ) {
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

  private async isProfessor(user_id: number) {
    const isProfessor = await this.prisma.teacher.findUnique({
      where: { user_id: user_id },
    });
    return isProfessor;
  }
}
