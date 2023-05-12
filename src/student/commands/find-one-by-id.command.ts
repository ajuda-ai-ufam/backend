import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';
import { StudentDTO } from '../dto/student.dto';

@Injectable()
export class FindOneByIdCommand {
  constructor(private prisma: PrismaService) {}

  async execute(id: number): Promise<StudentDTO> {
    const user_student = await this.prisma.student.findUnique({
      where: { user_id: id },
    });
    return user_student;
  }
}
