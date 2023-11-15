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

export class MissingFieldsException extends Error {
  constructor() {
    super();
    this.message = `Preencha todos os campos.`;
  }
}

export class InvalidNameException extends Error {
  constructor() {
    super();
    this.message = `O nome deve ter no mínimo um nome, sobrenome e no máximo 50 caracteres.`;
  }
}

export class InvalidSiapeException extends Error {
  constructor() {
    super();
    this.message = `O Código de identificação SIAPE deve ter no máximo 16 caracteres.`;
  }
}

export class InvalidEmailException extends Error {
  constructor() {
    super();
    this.message = `E-mail não é válido!`;
  }
}

export class InvalidContactEmailException extends Error {
  constructor() {
    super();
    this.message = `E-mail de contato não é válido!`;
  }
}

export class EmailAreadyExistsException extends Error {
  constructor() {
    super();
    this.message = `E-mail já cadastrado.`;
  }
}

export class ContactEmailAreadyExistsException extends Error {
  constructor() {
    super();
    this.message = `E-mail de contato já cadastrado.`;
  }
}

export class CourseNotFoundException extends Error {
  constructor() {
    super();
    this.message = `Curso não encontrado!`;
  }
}

export class InvalidEnrollmentException extends Error {
  constructor() {
    super();
    this.message = `Matrícula não atende aos requisitos!`;
  }
}

export class PersonalDataInPasswordException extends Error {
  constructor() {
    super();
    this.message = `A senha não deve conter dados pessoais como nome ou matricula.`;
  }
}

export class PasswordsDoNotMatchException extends Error {
  constructor() {
    super();
    this.message = `As senhas não são iguais!`;
  }
}

export class InvalidLinkedinURLException extends Error {
  constructor() {
    super();
    this.message = `Link do perfil do Linkedin não é compatível.`;
  }
}

export class InvalidWhatsAppNumberException extends Error {
  constructor() {
    super();
    this.message = `Número do WhatsApp inválido.`;
  }
}

export class EnrollmentAlreadyExistsException extends Error {
  constructor() {
    super();
    this.message = `Matrícula já cadastrada.`;
  }
}

export class OldPasswordNotProvidedException extends Error {
  constructor() {
    super();
    this.message = `Para criar uma nova senha, a senha antiga deve ser fornecida.`;
  }
}

export class WrongPasswordException extends Error {
  constructor() {
    super();
    this.message = `A senha informada não confere com os dados armazenados no sistema.`;
  }
}

export class InvalidStudentParametersException extends Error {
  constructor(paramArray: Array<any>) {
    super();
    this.message =
      'Os seguintes parâmetros só podem ser usados para usuários do tipo Estudante:';
    paramArray.forEach((parameter) => {
      this.message += ` ${parameter};`;
    });
  }
}
