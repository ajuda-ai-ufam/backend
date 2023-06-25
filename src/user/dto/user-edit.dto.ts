import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class UserEditDTO {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  name?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  password?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  oldPassword?: string;

  @IsOptional()
  @IsString()
  @ApiProperty()
  description?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  enrollment?: string;

  @IsOptional()
  @IsNumber()
  @ApiProperty()
  courseId?: number;

  @IsString()
  @IsNotEmpty()
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
