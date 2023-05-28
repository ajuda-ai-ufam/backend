import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';
import { GetUserInfoResponse } from '../dto/user-info.response.dto';

@Injectable()
export class GetUserInfoCommand {
  constructor(private prisma: PrismaService) {}

  async execute(userId: number): Promise<GetUserInfoResponse> {
    const user = await this.prisma.user.findFirst({
      where: { id: userId },
      include: { student: true },
    });

    if (!user.student) {
      return { name: user.name, email: user.email };
    }

    const userInfo: GetUserInfoResponse = {
      name: user.name,
      email: user.email,
      description: user.student?.description,
      enrollment: user.student?.enrollment,
      course_id: user.student?.course_id,
      contact_email: user.student?.contact_email,
      whatsapp: user.student?.whatsapp,
      linkedin: user.student?.linkedin,
    };

    return userInfo;
  }
}
