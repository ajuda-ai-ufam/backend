import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';
import { EmailService } from 'src/email/email.service';
import { UserService } from 'src/user/user.service';
import { Validations } from 'src/utils/validations';
import { CodeDTO } from './dto/generate-code.dto';
import { VerifyCodeDTO } from './dto/verify-code.dto';

@Injectable()
export class GenerateCodeService {

    constructor(private readonly prisma: PrismaService,
                private readonly userService: UserService,
                private readonly emailService: EmailService
                ){}


    async verifyCode(data: VerifyCodeDTO){

        const userExists = await this.userService.findOneByEmail(data.email);

        if(!userExists) throw new NotFoundException("Email não encontrado.");

        if(data.type_code == 1 && userExists.is_verified) throw new BadRequestException("Email já verificado.");

        const codeExists = await this.prisma.verification_Code.findFirst({where : {code : data.code,user_id: userExists.id,type_id: Number(data.type_code)},orderBy: {created_at : "desc"}});

        if(!codeExists) throw new NotFoundException("Código inválido.");
        
        if(codeExists.is_verified) throw new BadRequestException("Código já utilizado.");

        if(new Date() > codeExists.updated_at) throw new BadRequestException("Código expirado.");
        
        if(data.type_code == 1){
            // update table user-is_verified -> true
            await this.userService.updateVerified(userExists.id);
            await this.updateVerifiedCode(codeExists.id);
        }

        return {statusCode : 200,message: "Código verificado com sucesso."};










    }

    async generate(data: CodeDTO){

        if(!Validations.validateEmail(data.email)) throw new BadRequestException('Email não atende aos requisitos.');

        let email: string = "";

        let subject: string = "";

        let message: string = "";

        const date = new Date();

        const date_expired = new Date(date.getTime() + Number(process.env.EXPIRED_IN)*60000);

        const code = Math.floor(Math.random() * 100000) + 999999;

        const user = await this.userService.findOneByEmail(data.email);

        if(data.type_id == 2){
            email = user.email
            subject = process.env.SUBJECT_PASSWORD
            message = `Your code is ${String(code).slice(0,6)}` 
        }else{
            email = user.email
            subject = process.env.SUBJECT_VERIFY_USER
            message = `Your code is ${String(code).slice(0,6)}`
        } 
        

        if(user == null) throw new NotFoundException('Usuário não encontrado.');
    
        if(user.is_verified) throw new BadRequestException('Usuário com email ja verificado.');
        
        const codes_exists = await this.prisma.verification_Code.findFirst({ where : {user_id : user.id,type_id : Number(data.type_id)},orderBy: {
            created_at : "desc"
        }})

        if(codes_exists){
            const date_validade_before_of_generate = new Date(codes_exists.created_at.getTime() + 5*60000);

            if(new Date() < date_validade_before_of_generate && codes_exists.type_id == data.type_id) throw new BadRequestException("Você possui um código ativo,so pode ser gerado outro após 5 minutos.")
            else{

                const code_user = await this.prisma.verification_Code.create({
                    data : {
                        code : String(code).slice(0,6),
                        is_verified : false,
                        user_id : user.id,
                        created_at : date,
                        updated_at : date_expired,
                        type_id : Number(data.type_id)
                    }
                });
                
                await this.emailService.sendEmail(email,subject,message);

                return code_user;
            }

        }else{

            const code_user = await this.prisma.verification_Code.create({
                data : {
                    code : String(code).slice(0,6),
                    is_verified : false,
                    user_id : user.id,
                    created_at : date,
                    updated_at : date_expired,
                    type_id : Number(data.type_id)
                }
            });

            console.log(await this.emailService.sendEmail(email,subject,message));

            return code_user;
        }

    }

    async addMinutes(numOfMinutes, date) {
        date.setMinutes(date.getMinutes() + numOfMinutes);
      
        return date;
    }

    async updateVerifiedCode(id: number){
        return this.prisma.verification_Code.update({
            data: { is_verified: true },where:{
                id: id
            }
        })
    }

}
