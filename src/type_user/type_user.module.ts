import { Module } from '@nestjs/common';
import { TypeUserService } from './type_user.service';

@Module({
  providers: [TypeUserService],
})
export class TypeUserModule {}
