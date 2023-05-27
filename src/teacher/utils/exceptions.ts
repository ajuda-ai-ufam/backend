export class TeacherNotFoundException extends Error {
  constructor() {
    super();
    this.message = 'Professor(a) não encontrado(a).';
  }
}
