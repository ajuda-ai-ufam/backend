import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';
import { StudentDTO } from '../dto/student.dto';

@Injectable()
export class FindEnrollmentCommand {
  constructor(private prisma: PrismaService) {}

  async execute(enrollment: string): Promise<StudentDTO> {
    const user_enrollment = await this.prisma.student.findFirst({
      where: { enrollment: enrollment },
    });
    return user_enrollment;
  }
}
