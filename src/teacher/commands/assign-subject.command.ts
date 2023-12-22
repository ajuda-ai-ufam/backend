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
    
    const subjects = await this.subjectService.findMany(body.subject_ids);
    
    if (!subjects) throw new SubjectNotFoundException();

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
        (subjectResp) =>
        body.subject_ids.includes(subjectResp.subject_id) &&
        subjectResp.id_status !== SubjectResponsabilityStatus.FINISHED,
      ),
    );

    if (isAnyTeacherAlreadyAssigned) {
      throw new TeacherAlreadyResponsibleException();
    }

    await this.assingSubjectToProfessor(body.subject_ids, body.professors_ids);


    await this.sendEmailToTeachers(teachers,subjects);
  }

  /*****************************************************************************
   * Private / Supportive Methods
   */
  private async assingSubjectToProfessor(
    subject_ids: number[],
    professors_ids: number[],
  ) {
    await this.prisma.subjectResponsability.createMany({
      data:
        professors_ids.map((professor_id) =>
          subject_ids.map((subject_id) => ({
            professor_id,
            subject_id,
            id_status: SubjectResponsabilityStatus.APPROVED,
          }))
        )
        .reduce((acc, val) => acc.concat(val), []),
    });
  
    return { message: `Disciplina atribuida com sucesso!` };
  }
  
  
  

  private async sendEmailToTeachers(
    teachers: Array<any>,
    subjects: Array<any>,

  ) {
    for (const teacher of teachers) {
      for (const subject of subjects) {  
        const email = teacher.user.email;
        const teacherName = teacher.user.name;
        const subjectName = `${subject.code} - ${subject.name}`;
        const subjectId = subject.subject_id;
  
        await this.emailService.sendEmailAssignSubject(
          email,
          teacherName,
          subjectName,
          subjectId,
        );
      }
    }
  }
}