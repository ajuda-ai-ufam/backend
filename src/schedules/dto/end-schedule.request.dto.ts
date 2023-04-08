import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean } from 'class-validator';

export class EndScheduleRequestBody {
  @ApiProperty({
    type: Boolean,
    required: true,
  })
  @IsBoolean()
  realized?: boolean;
}
