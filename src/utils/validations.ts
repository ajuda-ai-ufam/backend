export class Validations {

  static validateName(name: string){
    
    const re = /^([A-Za-záàâãéèêíïóôõöúçñÁÀÂÃÉÈÍÏÓÔÕÖÚÇÑ'\s]{8,50})+$/;
    return re.test(name);

  }

  static validateEmail(email: string) {

    const re =/^(\w{3,20})@icomp.ufam.edu.br$/gm;
    return re.test(email);

  }

  static validateLinkedIn(linkedin: string) {

    const re = /^(https:(?:\/\/)www.linkedin.com(\/)in(\/))/gm;
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

  static searchNameEnrollmentPassword(password: string,name: string,enrollment: string) {

    if(password.indexOf(name) == -1) return false;
    else if(password.indexOf(enrollment) == -1) return false;
    else return true;

  }

  static validateConfirmPassword(password: string,confirm_password: string) {

    if(password == confirm_password) return true;
    else return false;
  
  }

}
