export class UserNotFoundException extends Error {
  constructor() {
    super();
    this.message = `Usuário não encontrado!`;
  }
}

export class UserNotVerifiedException extends Error {
  constructor() {
    super();
    this.message = `Usuário não verificado!`;
  }
}

export class ValidResetPasswordTokenFoundException extends Error {
  constructor() {
    super();
    this.message = `Você já possui um token de resetar a senha válido!`;
  }
}
