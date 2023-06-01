import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class UserEditDTO {
  @IsOptional()
  @IsString()
  @ApiProperty()
  name?: string;

  @IsOptional()
  @IsString()
  @ApiProperty()
  password?: string;

  @IsOptional()
  @IsString()
  @ApiProperty()
  oldPassword?: string;

  @IsOptional()
  @IsString()
  @ApiProperty()
  description?: string;

  @IsOptional()
  @IsString()
  @ApiProperty()
  enrollment?: string;

  @IsOptional()
  @IsNumber()
  @ApiProperty()
  courseId?: number;

  @IsString()
  @IsOptional()
  @ApiProperty()
  contactEmail?: string;

  @IsString()
  @IsOptional()
  @ApiProperty()
  whatsapp?: string;

  @IsString()
  @IsOptional()
  @ApiProperty()
  linkedin?: string;
}
