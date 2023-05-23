export class MonitorNotFoundException extends Error {
  constructor() {
    super();
    this.message = `Monitor(a) não encontrado(a)`;
  }
}

export class MonitorStatusNotAvailableException extends Error {
  constructor() {
    super();
    this.message = `Monitor(a) não disponível para agendamentos`;
  }
}

export class SameStudentException extends Error {
  constructor() {
    super();
    this.message = `Monitor(a) e usuário(a) logado são a mesma pessoa`;
  }
}

export class InvalidDateException extends Error {
  constructor() {
    super();
    this.message = `Data de início e/ou fim inválida(s)`;
  }
}

export class NotAnAvailableTimeException extends Error {
  constructor() {
    super();
    this.message = `A data do agendamento não está dentro dos horários disponíveis do monitor(a)`;
  }
}

export class MonitorTimeAlreadyScheduledException extends Error {
  constructor() {
    super();
    this.message = `Monitor(a) já possui um agendamento confirmado no horário solicitado`;
  }
}

export class StudentTimeAlreadyScheduledException extends Error {
  constructor(status: string) {
    super();
    this.message = `Aluno(a) já possui um agendamento com status '${status}' no horário solicitado`;
  }
}
