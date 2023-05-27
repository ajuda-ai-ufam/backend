import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/database/prisma.service';
import { hashPassword } from 'src/utils/bcrypt';
import { Validations } from 'src/utils/validations';
import { DecodedTokenPayload } from '../utils/decoded-token';
import {
  ExpiredCodeException,
  InvalidCodeException,
  InvalidPasswordException,
  InvalidTokenException,
  UsedCodeException,
} from '../utils/exceptions';

@Injectable()
export class ResetPasswordCommand {
  constructor(private prisma: PrismaService, private jwtService: JwtService) {}

  async execute(newPassword: string, token: string): Promise<void> {
    if (!Validations.validatePassword(newPassword))
      throw new InvalidPasswordException();

    let decodedTokenPayload: DecodedTokenPayload;

    try {
      decodedTokenPayload = this.jwtService.verify(token, {
        secret: process.env.SECRET_KEY,
      });
    } catch (error) {
      throw new InvalidTokenException();
    }

    const mostRecentCode = await this.prisma.verification_Code.findFirst({
      where: { code: decodedTokenPayload.code },
    });

    if (!mostRecentCode) throw new InvalidCodeException();

    if (mostRecentCode.is_verified) throw new UsedCodeException();

    if (new Date() > decodedTokenPayload.expiresAt)
      throw new ExpiredCodeException();

    await this.prisma.verification_Code.update({
      where: { code: decodedTokenPayload.code },
      data: { is_verified: true },
    });

    await this.prisma.user.update({
      where: { id: decodedTokenPayload.userId },
      data: { password: await hashPassword(newPassword) },
    });
  }
}
