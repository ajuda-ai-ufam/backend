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

export class UserNotCoordinatorException extends Error {
  constructor() {
    super();
    this.message = 'Usuário(a) logado(a) não é Coordenador(a).';
  }
}

export class CoordinatorIsNotFromDepartment extends Error {
  constructor() {
    super();
    this.message = 'Coordenador(a) não pertence ao Departamento da Disciplina.';
  }
}
