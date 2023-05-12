import { ApiProperty } from '@nestjs/swagger';

export class TypeUserDTO {
  @ApiProperty()
  type: string;
}
