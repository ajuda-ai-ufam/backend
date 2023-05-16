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
    this.message = 'Professor possui monitores com status bloqueantes.';
    blockingMonitors.forEach((monitor) => {
      this.message += ` Monitor ID: ${monitor.id} (status ${monitor.status.status}).`;
    });
  }
}
