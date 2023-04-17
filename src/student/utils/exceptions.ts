export class MonitorNotFoundException extends Error {
  constructor() {
    super();
    this.message = `Monitor não encontrado`;
  }
}

export class MonitorStatusNotAvailableException extends Error {
  constructor() {
    super();
    this.message = `Monitor não disponível para agendamentos`;
  }
}

export class SameStudentException extends Error {
  constructor() {
    super();
    this.message = `Monitor e usuário logado são a mesma pessoa`;
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
    this.message = `A data do agendamento não está dentro dos horários disponíveis do monitor`;
  }
}

export class MonitorTimeAlreadyScheduledException extends Error {
  constructor() {
    super();
    this.message = `Monitor já possui um agendamento confirmado no horário solicitado`;
  }
}
