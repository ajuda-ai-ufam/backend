import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';
import { UserEditDTO } from '../dto/user-edit.dto';
import { Validations } from 'src/utils/validations';
import {
  ContactEmailAreadyExistsException,
  CourseNotFoundException,
  InvalidContactEmailException,
  InvalidEnrollmentException,
  InvalidLinkedinURLException,
  InvalidNameException,
  InvalidPasswordException,
  InvalidStudentParametersException,
  InvalidWhatsAppNumberException,
  OldPasswordNotProvidedException,
  WrongPasswordException,
} from '../utils/exceptions';
import { CourseService } from 'src/course/course.service';
import { UserService } from '../user.service';
import { comparePassword, hashPassword } from 'src/utils/bcrypt';
import { Role } from 'src/auth/enums/role.enum';
import { UserFactory } from '../utils/user.factory';
import { Student } from '../domain/student';
import { Teacher } from '../domain/teacher';
import { Coordinator } from '../domain/coordinator';

@Injectable()
export class EditUserCommand {
  constructor(
    private prisma: PrismaService,
    private courseService: CourseService,
    private userService: UserService,
  ) {}

  async execute(
    data: UserEditDTO,
    userId: number,
    userRole: string,
  ): Promise<Student | Teacher | Coordinator> {
    if (userRole !== Role.Student) {
      this.verifyIfStudentParametersWerePassed(data);
    }

    this.verifyUserNameField(data);

    await this.verifyUserPasswordField(data, userId);

    if (userRole === Role.Student) {
      this.verifyStudentEnrollmentField(data);

      await this.verifyStudentCourseIdField(data);

      await this.verifyStudentContactEmailField(data);

      this.verifyStudentLinkedinField(data);

      this.verifyStudentWhatsAppField(data);
    }

    await this.prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        name: data.name,
        password: data.password,
        student:
          userRole === Role.Student
            ? {
                update: {
                  description: data.description,
                  enrollment: data.enrollment,
                  course_id: data.courseId,
                  contact_email: data.contactEmail,
                  whatsapp: data.whatsapp,
                  linkedin: data.linkedin,
                },
              }
            : {},
      },
    });

    if (userRole === Role.Student) {
      const student = await this.prisma.student.findUnique({
        where: {
          user_id: userId,
        },
        include: {
          user: true,
          course: true,
        },
      });

      return UserFactory.createStudent(student);
    }

    // TODO: Tratar os casos de professor e coordenador separadamente, ao invés de usar a tabela user.
    const teacher = await this.prisma.user.findUnique({
      where: {
        id: userId,
      },
    });

    return UserFactory.createTeacher(teacher);
  }

  /***********************************************************************************
   * Private / Supportive methods
   * *********************************************************************************
   */
  private verifyUserNameField(data: UserEditDTO) {
    data.name = data.name.trim();
    data.name = Validations.capitalizeName(data.name);
    if (!Validations.validateName(data.name)) {
      throw new InvalidNameException();
    }
  }

  private async verifyUserPasswordField(data: UserEditDTO, userId: number) {
    if (!data.oldPassword) {
      throw new OldPasswordNotProvidedException();
    }

    await this.checkPasswordInDatabase(userId, data.oldPassword);

    if (!Validations.validatePassword(data.password)) {
      throw new InvalidPasswordException();
    }

    data.password = await hashPassword(data.password);
  }

  private async checkPasswordInDatabase(userId: number, oldPassword: string) {
    const user = await this.prisma.user.findUnique({
      where: {
        id: userId,
      },
    });

    const passwordsMatch = await comparePassword(oldPassword, user.password);
    if (!passwordsMatch) {
      throw new WrongPasswordException();
    }
  }

  private verifyStudentEnrollmentField(data: UserEditDTO) {
    if (!Validations.validateEnrollment(data.enrollment)) {
      throw new InvalidEnrollmentException();
    }
  }

  private async verifyStudentCourseIdField(data: UserEditDTO) {
    const course = await this.courseService.findCourseId(data.courseId);
    if (course == null) throw new CourseNotFoundException();
  }

  private async verifyStudentContactEmailField(data: UserEditDTO) {
    if (!Validations.validateEmailContact(data.contactEmail)) {
      throw new InvalidContactEmailException();
    }
    const contact_email_exists = await this.userService.findOneByEmail(
      data.contactEmail,
    );

    if (contact_email_exists) throw new ContactEmailAreadyExistsException();
  }

  private verifyStudentLinkedinField(data: UserEditDTO) {
    if (!Validations.validateLinkedIn(data.linkedin)) {
      throw new InvalidLinkedinURLException();
    }
  }

  private verifyStudentWhatsAppField(data: UserEditDTO) {
    if (!Validations.validateWhatsapp(data.whatsapp)) {
      throw new InvalidWhatsAppNumberException();
    }
  }

  private verifyIfStudentParametersWerePassed(data: UserEditDTO) {
    const studentData = {
      description: data.description,
      enrollment: data.enrollment,
      courseId: data.courseId,
      contactEmail: data.contactEmail,
      whatsapp: data.whatsapp,
      linkedin: data.linkedin,
    };

    const validStudentParametersArray = Object.entries(studentData).filter(
      (element) => {
        return element[1];
      },
    );

    if (validStudentParametersArray.length > 0) {
      const obj = Object.fromEntries(validStudentParametersArray);
      const parametersKeysArray = Object.keys(obj);
      throw new InvalidStudentParametersException(parametersKeysArray);
    }
  }
}
