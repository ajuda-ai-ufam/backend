import { Controller, Post, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CodeDTO } from './dto/generate-code.dto';
import { GenerateCodeService } from './generate-code.service';

@Controller('code')
@ApiTags("Code")

export class GenerateCodeController {
  constructor(private readonly generateCodeService: GenerateCodeService) {}

  @Post("/generate")
  async generateCode(@Query() data : CodeDTO){
    return this.generateCodeService.generate(data);
  }
}
