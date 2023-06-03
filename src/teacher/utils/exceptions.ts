export class TeacherNotFoundException extends Error {
  constructor() {
    super();
    this.message = 'Professor(a) não encontrado(a).';
  }
}

export class TeacherAlreadyResponsibleException extends Error {
  constructor() {
    super();
    this.message = 'Professor(a) já responsável pela matéria.';
  }
}