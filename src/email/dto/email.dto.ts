import { ApiProperty } from '@nestjs/swagger';

export class EmailDTO {
  @ApiProperty()
  email: string;

  @ApiProperty()
  subject: string;

  @ApiProperty()
  message: string;
}
