import { ApiProperty } from "@nestjs/swagger";

export class VerifyCodeDTO{
    
    @ApiProperty()
    code: string;

    @ApiProperty()
    email: string;

    @ApiProperty()
    type_code: number;
}