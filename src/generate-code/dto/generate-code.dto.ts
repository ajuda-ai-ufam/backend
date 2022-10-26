import { ApiProperty } from "@nestjs/swagger";

export class CodeDTO {
     
    @ApiProperty()
    enrollment: string;

    @ApiProperty()
    email: string;

}