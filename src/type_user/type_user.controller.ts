import { Controller } from '@nestjs/common';
import { TypeUserService } from './type_user.service';

@Controller('type-user')
export class TypeUserController {
  constructor(private readonly typeUserService: TypeUserService) {}
}
