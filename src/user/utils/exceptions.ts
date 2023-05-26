export class UserNotFoundException extends Error {
  constructor() {
    super();
    this.message = `Usuário(a) não encontrado(a)!`;
  }
}

export class ValidResetPasswordTokenFoundException extends Error {
  constructor() {
    super();
    this.message = `Você já possui um token de resetar a senha válido!`;
  }
}

export class InvalidPasswordException extends Error {
  constructor() {
    super();
    this.message = `A senha não atende aos padrões de senha do sistema!`;
  }
}

export class InvalidCodeException extends Error {
  constructor() {
    super();
    this.message = `O código presente no token é invalido!`;
  }
}

export class InvalidTokenException extends Error {
  constructor() {
    super();
    this.message = `O token não é válido!`;
  }
}

export class ExpiredCodeException extends Error {
  constructor() {
    super();
    this.message = `O código para resetar a senha expirou! `;
  }
}

export class UsedCodeException extends Error {
  constructor() {
    super();
    this.message = `O código para resetar a senha já foi usado! `;
  }
}
