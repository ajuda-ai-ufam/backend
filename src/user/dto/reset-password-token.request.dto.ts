import { ApiProperty } from '@nestjs/swagger';
import { IsEmail } from 'class-validator';

export class ResetPasswordTokenRequestBody {
  @ApiProperty({
    type: String,
    required: true,
  })
  @IsEmail()
  email: string;
}
