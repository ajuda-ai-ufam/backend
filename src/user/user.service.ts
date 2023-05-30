import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CourseService } from 'src/course/course.service';
import { PrismaService } from 'src/database/prisma.service';
import { CreateStudentCommand } from 'src/student/commands/create-student.command';
import { FindEnrollmentCommand } from 'src/student/commands/find-enrollment.command';
import { TeacherService } from 'src/teacher/teacher.service';
import { hashPassword } from 'src/utils/bcrypt';
import { Validations } from 'src/utils/validations';
import { StudentCreateDTO } from './dto/student-create.dto';
import { TeacherCreateDTO } from './dto/teacher-create.dto';

@Injectable()
export class UserService {
  constructor(
    private prisma: PrismaService,
    private courseService: CourseService,
    private createStudentCommand: CreateStudentCommand,
    private findEnrollmentCommand: FindEnrollmentCommand,
    private teacherService: TeacherService,
  ) {}

  async createUserStudent(data: StudentCreateDTO) {
    const list_data_user = [
      data.confirm_password,
      data.email,
      data.enrollment,
      data.name,
      data.password,
      data.course_id,
    ];

    if (list_data_user.includes(''))
      throw new BadRequestException('Preencha todos os campos.');

    data.name = data.name.trim();

    if (!Validations.validateName(data.name))
      throw new BadRequestException(
        'O nome deve ter no mínimo um nome, sobrenome e no máximo 50 caracteres.',
      );

    if (!Validations.validateEmail(data.email))
      throw new BadRequestException('E-mail de contato não é válido!');

    if (data.contact_email.length == 0) data.contact_email = data.email;

    if (!Validations.validateEmailContact(data.contact_email))
      throw new BadRequestException('E-mail de contato não é válido!');

    const email_exists = await this.findOneByEmail(data.email);

    if (email_exists) throw new BadRequestException('E-mail já cadastrado.');

    const contact_email_exists = await this.findOneByEmail(data.contact_email);

    if (contact_email_exists)
      throw new BadRequestException('E-mail de contato já cadastrado.');

    const course = await this.courseService.findCourseId(data.course_id);

    if (course == null) throw new NotFoundException('Curso não encontrado!');

    if (!Validations.validateEnrollment(data.enrollment))
      throw new BadRequestException('Matrícula não atende aos requisitos!');

    if (!Validations.validatePassword(data.password))
      throw new BadRequestException('A senha não atende aos requisitos!');

    if (
      !Validations.searchNameEnrollmentPassword(
        data.password,
        data.name,
        data.enrollment,
      )
    )
      throw new BadRequestException(
        'A senha não deve conter dados como nome ou matricula.',
      );

    if (
      !Validations.validateConfirmPassword(data.password, data.confirm_password)
    )
      throw new BadRequestException('As senhas não são iguais!');

    if (!Validations.validateLinkedIn(data.linkedin))
      throw new BadRequestException(
        'Link do perfil do Linkedin não é compatível.',
      );

    if (!Validations.validateWhatsapp(data.whatsapp))
      throw new BadRequestException('Número do WhatsApp inválido.');

    const user_enrollment = await this.findEnrollmentCommand.execute(
      data.enrollment,
    );

    if (user_enrollment != null)
      throw new BadRequestException('Matrícula já cadastrada!');

    const user = await this.prisma.user.create({
      data: {
        email: data.email,
        name: Validations.capitalizeName(data.name),
        password: await hashPassword(data.password),
        is_verified: false,
        type_user_id: 1,
        created_at: new Date(),
        updated_at: new Date(),
      },
    });

    const student_object = {
      user_id: user.id,
      description: data.description,
      enrollment: data.enrollment,
      course_id: data.course_id,
      contact_email: data.contact_email,
      whatsapp: data.whatsapp,
      linkedin: data.linkedin,
    };

    await this.createStudentCommand.execute(student_object);

    return { status: 201, message: 'Cadastrado com sucesso!' };
  }

  async createUserTeacher(data: TeacherCreateDTO) {
    const list_data_user = [
      data.confirm_password,
      data.email,
      data.name,
      data.password,
    ];

    if (list_data_user.includes(''))
      throw new BadRequestException('Preencha todos os campos.');

    data.name = data.name.trim();

    if (!Validations.validateName(data.name))
      throw new BadRequestException(
        'O nome deve ter no mínimo um nome, sobrenome e no máximo 50 caracteres.',
      );

    if (!Validations.validateEmail(data.email))
      throw new BadRequestException('E-mail não atende aos requisitos!');

    const email_exists = await this.findOneByEmail(data.email);

    if (email_exists) throw new BadRequestException('E-mail já cadastrado.');

    if (!Validations.validatePassword(data.password))
      throw new BadRequestException('A senha não atende aos requisitos!');

    if (
      !Validations.searchNameEnrollmentPasswordTeacher(data.password, data.name)
    )
      throw new BadRequestException('A senha não deve conter dados como nome.');

    if (
      !Validations.validateConfirmPassword(data.password, data.confirm_password)
    )
      throw new BadRequestException('As senhas não são iguais!');

    const user = await this.prisma.user.create({
      data: {
        email: data.email,
        name: Validations.capitalizeName(data.name),
        password: await hashPassword(data.password),
        is_verified: false,
        type_user_id: 2,
        created_at: new Date(),
        updated_at: new Date(),
      },
    });

    await this.teacherService.create(user.id);

    return { status: 201, message: 'Cadastrado com sucesso!' };
  }

  async findAll() {
    return this.prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        is_verified: true,
      },
      orderBy: {
        created_at: 'asc',
      },
    });
  }

  async findOneByEmail(email: string) {
    return this.prisma.user.findUnique({
      where: { email },
      include: { student: true, type_user: true },
    });
  }

  async findOneById(id: number) {
    return this.prisma.user.findFirst({
      where: { id },
    });
  }

  async delete(id: number) {
    const user_exists = await this.prisma.user.findUnique({
      where: { id },
    });
    if (!user_exists)
      throw new BadRequestException('Usuário(a) não encontrado(a).');

    return this.prisma.user.delete({
      where: { id },
    });
  }

  async findOneByEnrollment(enrollment: string) {
    const student = await this.prisma.student.findFirst({
      where: { enrollment: enrollment },
      include: { user: true },
    });

    if (student == null)
      throw new NotFoundException('Usuário(a) não encontrado(a).');

    delete student.user.password;

    return student;
  }

  async updateVerified(id: number) {
    return this.prisma.user.update({
      data: {
        is_verified: true,
      },
      where: { id: id },
    });
  }
}
