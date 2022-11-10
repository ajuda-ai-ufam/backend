import { ApiProperty } from '@nestjs/swagger';
import { IsEmpty, IsString } from 'class-validator';

export class StudentCreateDTO {
  @ApiProperty()
  email: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  password: string;

  @ApiProperty()
  confirm_password: string;

  @IsString()
  @IsEmpty()
  @ApiProperty()
  description?: string;

  @ApiProperty()
  enrollment: string;

  @ApiProperty()
  course_id: number;

  @IsEmpty()
  @IsString()
  @ApiProperty()
  contact_email?: string;

  @IsString()
  @IsEmpty()
  @ApiProperty()
  whatsapp?: string;

  @IsString()
  @IsEmpty()
  @ApiProperty()
  linkedin?: string;
}
