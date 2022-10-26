import { ApiProperty } from "@nestjs/swagger";

export class CodeDTO {
     
    @ApiProperty()
    email: string;

    @ApiProperty()
    type_id : number

}