export class TeacherNotFoundException extends Error {
  constructor() {
    super();
    this.message = 'Professor não encontrado.';
  }
}
