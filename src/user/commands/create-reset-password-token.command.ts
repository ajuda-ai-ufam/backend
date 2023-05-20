import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/database/prisma.service';
import { EmailService } from 'src/email/email.service';
import {
  ValidResetPasswordTokenFoundException,
  UserNotVerifiedException,
  UserNotFoundException,
} from 'src/user/utils/exceptions';
import { VerificationCodeType } from 'src/user/utils/verification-code.enum';
import { JWTRecoverToken } from '../utils/jwt-recover.interface';

@Injectable()
export class CreateResetPasswordTokenCommand {
  constructor(
    private prisma: PrismaService,
    private emailService: EmailService,
    private jwtService: JwtService,
  ) {}

  async execute(email: string): Promise<void> {
    const user = await this.prisma.user.findFirst({
      where: {
        email,
      },
    });

    if (!user) {
      throw new UserNotFoundException();
    }

    if (!user.is_verified) {
      throw new UserNotVerifiedException();
    }

    const code = await this.prisma.verification_Code.findFirst({
      where: {
        user_id: user.id,
        type_id: VerificationCodeType.RESET_PASSWORD,
        is_verified: false,
      },
    });

    const now = new Date();
    const expiresAt = new Date(
      now.getTime() +
        Number(process.env.RESET_PASSWORD_TOKEN_EXPIRATION_TIME_IN_MIN) * 60000,
    );

    if (code && code.created_at <= expiresAt) {
      throw new ValidResetPasswordTokenFoundException();
    }

    const newVerificationCode = {
      code: String(Math.floor(Math.random() * 100000) + 999999).slice(0, 6),
      is_verified: false,
      user_id: user.id,
      created_at: now,
      updated_at: now,
      type_id: VerificationCodeType.RESET_PASSWORD,
    };

    const generatedCode = await this.prisma.verification_Code.create({
      data: newVerificationCode,
    });

    const payload: JWTRecoverToken = {
      userId: user.id,
      code: generatedCode.code,
      expiresAt,
    };

    const token = this.jwtService.sign(payload);

    await this.emailService.sendEmailResetPassword(user.email, token);
  }
}
