import { Coordinator } from '../domain/coordinator';
import { Student } from '../domain/student';
import { Teacher } from '../domain/teacher';

export class UserFactory {
  static createStudent(prismaStudent): Student {
    const student: Student = {
      id: prismaStudent.user_id,
      name: prismaStudent.user.name,
      email: prismaStudent.user.email,
      contactEmail: prismaStudent.contact_email,
      description: prismaStudent.description,
      enrollment: prismaStudent.enrollment,
      whatsapp: prismaStudent.whatsapp,
      linkedin: prismaStudent.linkedin,
      courseId: prismaStudent.course_id,
      course: prismaStudent.course && {
        id: prismaStudent.course.id,
        name: prismaStudent.course.name,
      },
    };

    return student;
  }

  static createTeacher(prismaTeacher): Teacher {
    const teacher: Teacher = {
      id: prismaTeacher.id,
      name: prismaTeacher.name,
      email: prismaTeacher.email,
    };

    return teacher;
  }

  static createCoordinator(prismaCoordinator): Coordinator {
    const coordinator: Coordinator = {
      id: prismaCoordinator.id,
      name: prismaCoordinator.name,
      email: prismaCoordinator.email,
    };

    return coordinator;
  }
}
