import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';
import { hashPassword } from 'src/utils/bcrypt';
import { UserCreateDto } from './dto/user-create.dto';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async create(data: UserCreateDto) {
    const email_exists = await this.findOneByEmail(data.email);
    if (email_exists) throw new BadRequestException('Email já cadastrado.');

    const user = await this.prisma.user.create({
      data: {
        ...data,
        password: await hashPassword(data.password),
      },
    });
    return user;
  }

  async findAll() {
    return this.prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        is_verified: true,
      },
      orderBy: {
        created_at: 'asc',
      },
    });
  }

  async findOneByEmail(email: string) {
    return this.prisma.user.findUnique({
      where: { email },
    });
  }

  async delete(id: number) {
    const user_exists = await this.prisma.user.findUnique({
      where: { id },
    });
    if (!user_exists) throw new BadRequestException('Usuário não encontrado.');

    return this.prisma.user.delete({
      where: { id },
    });
  }
}
