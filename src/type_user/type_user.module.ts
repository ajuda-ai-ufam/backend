import { Module } from '@nestjs/common';
import { TypeUserService } from './type_user.service';
import { TypeUserController } from './type_user.controller';

@Module({
  controllers: [TypeUserController],
  providers: [TypeUserService]
})
export class TypeUserModule {}
