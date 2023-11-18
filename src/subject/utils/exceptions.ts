export class ResponsabilityNotFoundException extends Error {
  constructor() {
    super();
    this.message = 'Não foi encontrada nenhuma responsabilidade.';
  }
}

export class SubjectNotFoundException extends Error {
  constructor() {
    super();
    this.message = 'Disciplina não encontrada.';
  }
}

export class StudentAlreadyEnrolledException extends Error {
  constructor() {
    super();
    this.message = 'Aluno(a) já matriculado(a) na disciplina.';
  }
}

export class StudentMonitorException extends Error {
  constructor() {
    super();
    this.message = 'Aluno(a) é monitor(a) da disciplina.';
  }
}

export class StudentNotEnrolledException extends Error {
  constructor() {
    super();
    this.message = 'Aluno(a) não está matriculado(a) na disciplina.';
  }
}

export class AlreadyFinishedException extends Error {
  constructor() {
    super();
    this.message = 'Responsabilidade já finalizada.';
  }
}

export class BlockingMonitorsException extends Error {
  constructor(blockingMonitors: Array<any>) {
    super();
    this.message = 'Professor(a) possui monitores(a) com status bloqueantes.';
    blockingMonitors.forEach((monitor) => {
      this.message += ` Monitor(a) ID: ${monitor.id} (status ${monitor.status.status}).`;
    });
  }
}

export class UserNotStudentException extends Error {
  constructor() {
    super();
    this.message = 'Usuário(a) logado(a) não é aluno(a).';
  }
}
