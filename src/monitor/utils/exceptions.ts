export class EmptyAvailabilityException extends Error {
  constructor() {
    super();
    this.message =
      'Um(a) monitor(a) precisa ter pelo menos um dia disponível para agendamentos.';
  }
}

export class InvalidPreferentialPlaceException extends Error {
  constructor() {
    super();
    this.message = 'Local de antedimento preferencial inválido';
  }
}

export class UserLoggedNotResponsableForMonitoringException extends Error {
  constructor() {
    super();
    this.message =
      'Usuário(a) logado(a) não é responsável pela monitoria que está sendo alterada.';
  }
}

export class EditMonitorBodyMissingFieldsException extends Error {
  constructor() {
    super();
    this.message = 'Nenhum dos campos foi passado para edição.';
  }
}

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

export class InvalidTokenException extends Error {
  constructor() {
    super();
    this.message = `O token não é válido!`;
  }
}
