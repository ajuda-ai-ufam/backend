import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { IsPublic } from 'src/auth/decorators/is-public.decorator';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { StudentCreateDTO } from './dto/student-create.dto';
import { TeacherCreateDTO } from './dto/teacher-create.dto';
import { UserService } from './user.service';

@Controller('user')
@ApiTags('User')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('student')
  @IsPublic()
  async createUserStudent(@Body() data: StudentCreateDTO) {
    return this.userService.createUserStudent(data);
  }

  @Post('teacher')
  @IsPublic()
  async createUserTeacher(@Body() data: TeacherCreateDTO) {
    return this.userService.createUserTeacher(data);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('access_token')
  async findAll() {
    return this.userService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('access_token')
  @Get('/get')
  async findOne(@Query('enrollment') enrollment: string) {
    return this.userService.findOneByEnrollment(enrollment);
  }
  
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('access_token')
  @Delete(':id')
  async delete(@Param('id') id: string) {
    return this.userService.delete(+id);
  }
}
