import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';
import { hashPassword } from 'src/utils/bcrypt';
import { UserCreateDto } from './dto/user-create.dto';
import { UserUpdateDto } from './dto/user-update.dto';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async create(data: UserCreateDto) {
    const user_exists = await this.prisma.user.findFirst({
      where: { registration: data.registration },
    });
    if (user_exists) throw new BadRequestException('Usuário já existe.');
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
        registration: true,
        email: true,
        role: true,
        course: {
          select: {
            name: true,
          },
        },
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

  async update(id: string, data: UserUpdateDto) {
    const user_exists = await this.prisma.user.findUnique({
      where: { id },
    });
    if (!user_exists) throw new BadRequestException('Usuário não encontrado.');

    return this.prisma.user.update({
      data,
      where: { id },
    });
  }

  async delete(id: string) {
    const user_exists = await this.prisma.user.findUnique({
      where: { id },
    });
    if (!user_exists) throw new BadRequestException('Usuário não encontrado.');

    return this.prisma.user.delete({
      where: { id },
    });
  }
}
