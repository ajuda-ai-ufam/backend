import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { CodeDTO } from './dto/generate-code.dto';
import { VerifyCodeDTO } from './dto/verify-code.dto';
import { GenerateCodeService } from './generate-code.service';

@Controller('code')
@ApiTags("Code")

export class GenerateCodeController {
  constructor(private readonly generateCodeService: GenerateCodeService) {}

  @ApiOperation({description:"Rota para listar todos os type-codes."})
  @Get("type-code")
  async typeCode(){
    return this.generateCodeService.typeCode();
  }

  @ApiOperation({description:"Rota para gerar o código de verificação do email ou de senha."})
  @Post("generate")
  async generateCode(@Body() data : CodeDTO){
    return this.generateCodeService.generate(data);
  }

  @ApiOperation({description:"Rota para validar o código gerado."})
  @Post("verify")
  async verifyCode(@Body() data: VerifyCodeDTO){
    return this.generateCodeService.verifyCode(data);
  }
}
