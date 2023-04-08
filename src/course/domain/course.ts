import { ApiProperty } from '@nestjs/swagger';

export class Course {
  @ApiProperty({ type: Number })
  id: number;

  @ApiProperty({ type: String })
  name: string;

  // TODO - Make not optional
  @ApiProperty({ type: String })
  code?: string;
}
