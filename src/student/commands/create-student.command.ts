import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';
import { StudentDTO } from '../dto/student.dto';

@Injectable()
export class CreateStudentCommand {

  constructor(
    private prisma: PrismaService,
  ) {}

  async execute(data: StudentDTO): Promise<StudentDTO> {
    const student = await this.prisma.student.create({ data: data });
    return student;
  }

}
