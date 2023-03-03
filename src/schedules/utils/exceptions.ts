export class ProfessorNotAuthorizedException extends Error {
  constructor() {
    super();
    this.message = 'Você não ter permissão para realizar esta ação';
  }
}
