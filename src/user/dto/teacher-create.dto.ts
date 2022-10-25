import { ApiProperty } from "@nestjs/swagger";

export class TeacherCreateDTO{

    @ApiProperty()
    email: string;

    @ApiProperty()
    name: string;

    @ApiProperty()
    password: string;

    @ApiProperty()
    confirm_password: string;

}