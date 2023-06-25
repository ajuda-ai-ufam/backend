import { ApiProperty } from '@nestjs/swagger';

export class Topic {
  @ApiProperty({
    type: Number,
  })
  id: number;

  @ApiProperty({
    type: String,
  })
  name: string;

  @ApiProperty({
    type: String,
  })
  token: string;

  @ApiProperty({
    type: Date,
  })
  updated_at: Date;

  @ApiProperty({
    type: Date,
  })
  created_at: Date;
}
