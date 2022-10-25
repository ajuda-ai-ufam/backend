import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';
import { StudentDTO } from './dto/student.dto';

@Injectable()
export class StudentService {

    constructor(private prisma: PrismaService){}

    async create(data : StudentDTO){

        const student =  await this.prisma.student.create({data : data});
        return student;
        
    }

    async findEnrollment(enrollment : string){

        const user_enrollment = await this.prisma.student.findFirst({where : {enrollment : enrollment}});
        
        return user_enrollment;

    }


}
