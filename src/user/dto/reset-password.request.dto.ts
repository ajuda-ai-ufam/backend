import { ApiProperty } from '@nestjs/swagger';

export class ResetPasswordRequestBody {
  @ApiProperty({
    type: String,
    required: true,
  })
  newPassword: string;
  @ApiProperty({
    type: String,
    required: true,
  })
  token: string;
}
