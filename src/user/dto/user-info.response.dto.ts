import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';

export class GetUserInfoResponse {
  @ApiProperty()
  name: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  @IsOptional()
  description?: string;

  @ApiProperty()
  @IsOptional()
  enrollment?: string;

  @ApiProperty()
  @IsOptional()
  course_id?: number;

  @ApiProperty()
  @IsOptional()
  contact_email?: string;

  @ApiProperty()
  @IsOptional()
  whatsapp?: string;

  @ApiProperty()
  @IsOptional()
  linkedin?: string;
}
