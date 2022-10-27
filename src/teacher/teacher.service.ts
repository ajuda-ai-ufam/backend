import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';

@Injectable()
export class TeacherService {
    
    constructor(private prisma: PrismaService){}

    async create(user_id: number){

        const user_teacher = await this.prisma.teacher.create({data : {user_id : user_id}});

        return user_teacher;
    }
}
