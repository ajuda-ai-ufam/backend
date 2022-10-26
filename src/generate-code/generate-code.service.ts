import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';
import { StudentService } from 'src/student/student.service';
import { UserService } from 'src/user/user.service';
import { CodeDTO } from './dto/generate-code.dto';

@Injectable()
export class GenerateCodeService {

    constructor(private readonly prisma: PrismaService,
                private readonly studentService: StudentService,
                private readonly userService: UserService,
                ){}

    async generate(data: CodeDTO){

        const date = new Date();
        const date_expired = new Date(date.getTime() + Number(process.env.EXPIRED_IN)*60000);

        const code = Math.floor(Math.random() * 100000) + 999999;

        const user = await this.userService.findOneByEmail(data.email);


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
                        code : String(code),
                        is_verified : false,
                        user_id : user.id,
                        created_at : date,
                        updated_at : date_expired,
                        type_id : Number(data.type_id)
                    }
                });
    
                return code_user;
            }
        }else{
            const code_user = await this.prisma.verification_Code.create({
                data : {
                    code : String(code),
                    is_verified : false,
                    user_id : user.id,
                    created_at : date,
                    updated_at : date_expired,
                    type_id : Number(data.type_id)
                }
            });

            return code_user;
        }

    }

    async addMinutes(numOfMinutes, date) {
        date.setMinutes(date.getMinutes() + numOfMinutes);
      
        return date;
    }

}
