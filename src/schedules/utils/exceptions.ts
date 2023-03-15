export class InvalidScheduleStatusException extends Error {
  constructor(status: string) {
    super();
    this.message = `Agendamentos com status "${status}" não permitem esta ação.`;
  }
}

export class NotFinalizedScheduleException extends Error {
  constructor(end: Date) {
    super();
    this.message = `O agendamento ainda não passou do horário de fim: ${end.toLocaleString()}.`;
  }
}

export class NotTheScheduleMonitorException extends Error {
  constructor() {
    super();
    this.message = 'Apenas o monitor do agendamento pode realizar esta ação.';
  }
}

export class NotTheScheduleParticipantException extends Error {
  constructor() {
    super();
    this.message = 'Apenas um dos participantes do agendamento pode realizar esta ação.';
  }
}

export class ProfessorNotAuthorizedException extends Error {
  constructor() {
    super();
    this.message = 'Você não ter permissão para realizar esta ação.';
  }
}

export class ScheduleNotFoundException extends Error {
  constructor() {
    super();
    this.message = 'Agendamento não encontrado.';
  }
}
