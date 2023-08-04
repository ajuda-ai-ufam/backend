export class Validations {
  static capitalizeName(name: string) {
    return name.replace(/\b(\w)/g, (s) => s.toUpperCase());
  }

  static validateName(name: string) {
    const re =
      /^(?! )[a-zA-ZáàâãéèêíïóôõöúçñÁÀÂÃÉÈÍÏÓÔÕÖÚÇÑ',. -]+([',. -][a-zA-ZáàâãéèêíïóôõöúçñÁÀÂÃÉÈÍÏÓÔÕÖÚÇÑ]+)+$/gm;
    return re.test(name);
  }

  static validatePassword(password: string): boolean {
    if (password.length >= 8 && password.length <= 18) return true;
    return false;
  }

  static validateEmail(email: string) {
    const re = /^([\w.-]{3,20})@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/gm;
    return re.test(email);
  }

  static validateEmailContact(email: string) {
    const re = /^([\w.-]{3,20})@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/gm;
    return re.test(email);
  }

  static validateEnrollment(enrollment: string) {
    const re = /^([\d]{8})$/gm;
    return re.test(enrollment);
  }

  static validateLinkedIn(linkedin: string) {
    if (linkedin.length == 0) return true;
    const re =
      /^(http(s)?:\/\/)?([\w]+\.)?linkedin\.com\/(pub|in|profile)\/([-a-zA-Z0-9]+)\/*/gm;
    return re.test(linkedin);
  }

  static validateWhatsapp(whatsapp: string) {
    if (whatsapp.length == 0) return true;
    const re = /^([1-9]{1})(\d{10})$/gm;
    return re.test(whatsapp);
  }

  static searchNameEnrollmentPasswordTeacher(password: string, name: string) {
    if (password.indexOf(name) == -1) return true;
    return false;
  }

  static searchNameEnrollmentPassword(
    password: string,
    name: string,
    enrollment: string,
  ) {
    if (password.indexOf(name) == -1) return true;
    if (password.indexOf(enrollment) == -1) return true;
    return false;
  }

  static validateConfirmPassword(password: string, confirm_password: string) {
    if (password == confirm_password) return true;
    return false;
  }
}
