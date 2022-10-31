import { Body, Controller, Post, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CodeDTO } from './dto/generate-code.dto';
import { VerifyCodeDTO } from './dto/verify-code.dto';
import { GenerateCodeService } from './generate-code.service';

@Controller('code')
@ApiTags("Code")

export class GenerateCodeController {
  constructor(private readonly generateCodeService: GenerateCodeService) {}

  @Post("generate")
  async generateCode(@Body() data : CodeDTO){
    return this.generateCodeService.generate(data);
  }

  @Post("verify")
  async verifyCode(@Body() data: VerifyCodeDTO){
    return this.generateCodeService.verifyCode(data);
  }
}
