import { ApiProperty } from '@nestjs/swagger';

export class ParamIdDto {
  @ApiProperty({
    required: true,
    type: Number,
  })
  id: number;
}
