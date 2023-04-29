import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

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
  @ApiProperty()
  description?: string;

  @ApiProperty()
  enrollment: string;

  @ApiProperty()
  course_id: number;

  @IsString()
  @ApiProperty()
  contact_email?: string;

  @IsString()
  @ApiProperty()
  whatsapp?: string;

  @IsString()
  @ApiProperty()
  linkedin?: string;
}
