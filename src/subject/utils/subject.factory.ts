import { Subject } from '../domain/subject';

export class SubjectFactory {
  static createSubject(subject): Subject {
    return {
      id: subject.id,
      code: subject.code,
      name: subject.name,
      course: {
        id: subject.course_id,
        name: subject.course.name,
        code: subject.course.code,
      },
    };
  }
}
