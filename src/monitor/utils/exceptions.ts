export class MonitoringNotFoundException extends Error {
  constructor() {
    super();
    this.message = 'Não foi encontrada nenhuma monitoria com o id informado.';
  }
}

export class NotTheResponsibleProfessorException extends Error {
  constructor() {
    super();
    this.message =
      'Você não é o(a) professor(a) responsável por essa disciplina.';
  }
}

export class InvalidMonitoringStatusException extends Error {
  constructor(status: string) {
    super();
    this.message = `Monitoria possui status bloqueante: ${status}`;
  }
}

export class ScheduledMonitoringNotFoundException extends Error {
  constructor() {
    super();
    this.message = 'Não foi encontrado nenhum agendamento com o id informado.';
  }
}

export class ScheduleNotPendingException extends Error {
  constructor() {
    super();
    this.message =
      'O agendamento deve estar com status Pendente para realizar esta ação.';
  }
}

export class NotTheScheduleMonitorException extends Error {
  constructor() {
    super();
    this.message = 'Você não tem permissão para rejeitar este agendamento';
  }
}
