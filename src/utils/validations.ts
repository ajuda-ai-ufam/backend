export class Validations {

  static validateName(name: string){
    //ajeitar

    const re = /^([A-Za-záàâãéèêíïóôõöúçñÁÀÂÃÉÈÍÏÓÔÕÖÚÇÑ'\s]{1,50})+$/;
    return re.test(name);
  }

  static validateEmail(email: string) {
    const re =
      /^([a-zA-z0-9]{3,20})@icomp.ufam.edu.br$/gm;
    return re.test(email);
  }

  static validateLinkedIn(linkedin: string) {
    const re =
    /^(https:(?:\/\/)www.linkedin.com(\/)in(\/))/gm;
    return re.test(linkedin);
  }

  static validateWhatsapp(whatsapp: string){
    const re = /^([1-9]{1})([0-9]{10})$/gm;
    return re.test(whatsapp);
  }

  static validatePassword(password: string) {
    if(password.length >=8 && password.length <=18){
      return true;
    }else{
      return false;
    }
  }

  static searchNameEnrollmentPassword(password: string,name: string,enrollment: string) {
    if(password.includes(name) || password.includes(enrollment)){
      return false;
    }else{
      return true;
    }
  }

  static validateConfirmPassword(password: string,confirm_password: string) {
    if(password == confirm_password){
      return true;
    }else{
      return false;
    }
  }

}
