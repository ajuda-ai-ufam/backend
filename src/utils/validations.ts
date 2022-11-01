export class Validations {

  static validateEnrollment(enrollment: string) {

    const re = /^([\d]{8})$/gm;
    return re.test(enrollment);

  }

  static validateName(name: string){
    
    //const re = /^([a-zA-ZáàâãéèêíïóôõöúçñÁÀÂÃÉÈÍÏÓÔÕÖÚÇÑ']{3,}){1}+(([',. -][a-zA-ZáàâãéèêíïóôõöúçñÁÀÂÃÉÈÍÏÓÔÕÖÚÇÑ' ]{6,50})?[a-zA-ZáàâãéèêíïóôõöúçñÁÀÂÃÉÈÍÏÓÔÕÖÚÇÑ' ]{6,50}){1,}$/gm;
    //return re.test(name);
    return true;
    

  }

  static validateEmail(email: string) {

    const re =/^([\w.]{3,20})@icomp.ufam.edu.br$/gm;
    return re.test(email);

  }

  static validateEmailContact(email: string) {

    const re =/^([\w.]{3,20})@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/gm;
    return re.test(email);

  }

  static validateLinkedIn(linkedin: string) {

    const re = /^(https:(?:\/\/)www.linkedin.com(\/)in(\/)([\w.#&-]{5,60}))(\/)$/gm;
    if(linkedin.length == 0) return true;
    else return re.test(linkedin);
    
    
  }

  static validateWhatsapp(whatsapp: string){

    const re = /^([1-9]{1})(\d{10})$/gm;
    if(whatsapp.length == 0) return true;
    else return re.test(whatsapp);
    
  }

  static validatePassword(password: string) {

    if(password.length >=8 && password.length <=18) return true;
    else return false;
    
  }

  static searchNameEnrollmentPasswordTeacher(password: string,name: string){
    if(password.indexOf(name) == -1) return true;
    else return false;
  }

  static searchNameEnrollmentPassword(password: string,name: string,enrollment: string) {

    if(password.indexOf(name) == -1) return true;
    else if(password.indexOf(enrollment) == -1) return true;
    else return false;

  }

  static validateConfirmPassword(password: string,confirm_password: string) {

    if(password == confirm_password) return true;
    else return false;
  
  }

}
