import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';
import { QueryDto } from './dto/query.dto';

@Injectable()
export class SubjectService {
  constructor(private prisma: PrismaService) {}

  async findAll(query: QueryDto) {
    return this.prisma.subject.findMany();
  }
}
