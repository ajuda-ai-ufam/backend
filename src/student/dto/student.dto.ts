import { ApiProperty } from "@nestjs/swagger";

export class StudentDTO {

    @ApiProperty()
    user_id : number;

    @ApiProperty()
    description : string;

    @ApiProperty()
    enrollment : string;

    @ApiProperty()
    course_id : number;

    @ApiProperty()
    contact_email : string;

    @ApiProperty()
    whatsapp : string;

    @ApiProperty()
    linkedin : string;

}