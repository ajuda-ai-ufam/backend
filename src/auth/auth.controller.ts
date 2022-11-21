import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { LocalAuthGuard } from './guards/local-auth.guard';

@Controller('auth')
@ApiTags('Auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @ApiOperation({ description: 'Rota para login.' })
  @Post('login')
  @UseGuards(LocalAuthGuard)
  async login(@Body() data: LoginDto) {
    return this.authService.login(data);
  }
}
