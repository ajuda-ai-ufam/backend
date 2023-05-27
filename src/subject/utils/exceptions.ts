export class ResponsabilityNotFoundException extends Error {
  constructor() {
    super();
    this.message = 'Não foi encontrada nenhuma responsabilidade.';
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
