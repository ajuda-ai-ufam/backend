import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CourseService } from 'src/course/course.service';
import { PrismaService } from 'src/database/prisma.service';
import { StudentService } from 'src/student/student.service';
import { hashPassword } from 'src/utils/bcrypt';
import { Validations } from 'src/utils/validations';
import { StudentCreateDTO } from './dto/student-create.dto';
import { TeacherCreateDTO } from './dto/teacher-create.dto';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService,
              private readonly courseService: CourseService,
              private readonly studentService: StudentService) {}

  async createUserStudent(data: StudentCreateDTO) {

    data.name = data.name.trim();
    //ajeitar validacao de nome
    if(!Validations.validateName(data.name)) throw new BadRequestException("O nome deve ter no minimo 1 nome e 1 sobrenome e no maximo 50 caracteres.");

    if(!Validations.validateEmail(data.email)) throw new BadRequestException("Email não atende aos requisitos!");

    if(!Validations.validateEmail(data.contact_email)) throw new BadRequestException("Email de contato não atende aos requisitos!");

    const email_exists = await this.findOneByEmail(data.email);

    if (email_exists) throw new BadRequestException('Email já cadastrado.');

    const contact_email_exists = await this.findOneByEmail(data.contact_email);

    if (contact_email_exists) throw new BadRequestException('Email de contato já cadastrado.');

    const course = await this.courseService.findCourseId(data.course_id);

    if(course == null) throw new NotFoundException("Curso não encontrado!");

    if(!Validations.validateEnrollment(data.enrollment)) throw new BadRequestException("Matricula não atende aos requisitos!")

    if(!Validations.validatePassword(data.password)) throw new BadRequestException("A senha não atende aos requisitos!");

    if(!Validations.searchNameEnrollmentPassword(data.password,data.name,data.enrollment)) throw new BadRequestException("A senha não deve conter dados como nome ou matricula.");

    if(!Validations.validateConfirmPassword(data.password,data.confirm_password)) throw new BadRequestException("As senhas não são iguais!");
    
    if(!Validations.validateLinkedIn(data.linkedin)) throw new BadRequestException("Link do perfil do Linkedin não é compativel.")
    
    if(!Validations.validateWhatsapp(data.whatsapp)) throw new BadRequestException("Número do Whatsapp inválido.");

    const user_enrollment = await this.studentService.findEnrollment(data.enrollment);

    if(user_enrollment != null) throw new BadRequestException("Matricula ja cadastrada!");
    
    const user = await this.prisma.user.create({
      data: {
        email : data.email,
        name : data.name.toUpperCase(),
        password: await hashPassword(data.password),
        is_verified : false,
        type_user_id : 1,
        created_at : new Date(),
        updated_at : new Date()
      },
    });

    const student_object = {
      "user_id" : user.id,
      "description" : data.description,
      "enrollment" : data.enrollment,
      "course_id" : data.course_id,
      "contact_email" : data.contact_email,
      "whatsapp"  : data.whatsapp,
      "linkedin"  : data.linkedin
    }

    const student = await this.studentService.create(student_object);

    return student;
  }

  async createUserTeacher(data : TeacherCreateDTO){
    return data;
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
      include : { student : true}
    });
  }

  async delete(id: number) {
    const user_exists = await this.prisma.user.findUnique({
      where: { id },
    });
    if (!user_exists) throw new BadRequestException('Usuário não encontrado.');

    return this.prisma.user.delete({
      where: { id },
    });
  }

  async findOneByEnrollment(enrollment: string) {

    const student = await this.prisma.student.findFirst({
      where : {enrollment : enrollment},
      include : { user : true}
    })

    if(student == null) throw new NotFoundException("Usuário não encontrado.");

    delete student.user.password;

    return student;

  }
}
