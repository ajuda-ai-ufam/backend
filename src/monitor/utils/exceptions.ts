export class MonitoringNotFoundException extends Error {
  constructor() {
    super();
    this.message = 'Não foi encontrada nenhuma monitoria com o id informado.';
  }
}

export class NotTheResponsibleProfessorException extends Error {
  constructor() {
    super();
    this.message = 'Você não é o professor responsável por essa disciplina.';
  }
}

export class InvalidMonitoringStatusException extends Error {
  constructor(status: string) {
    super();
    this.message = `Monitoria possui status bloqueante: ${status}`;
  }
}
