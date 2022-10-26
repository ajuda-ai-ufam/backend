import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { create } from 'domain';
import { NotFoundError } from 'rxjs';
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

        const code = 

        const user_student = await this.userService.findOneByEnrollment(data.enrollment);

        if(user_student == null) throw new NotFoundException('Usuário não encontrado.');
        
        if(user_student.user.is_verified) throw new BadRequestException('Usuário com email ja verificado.');

        if(user_student.user.type_user_id == 1){
            
            const generate_code = parseInt(Math.random() * 100000);

            await this.prisma.verification_Code.create({
                data : {
                    code : generate_code,
                    is_verified : false,
                    user_id : user_student.user_id,
                    created_at : new Date(),
                    type_id : 1
                    
                }
            });

        }else{

        }
        

    }

}
