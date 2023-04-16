import {
  Injectable,
  NotFoundException,
  PreconditionFailedException,
} from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';
import { SubjectResponsability } from '@prisma/client';

@Injectable()
export class EndResponsabilityCommand {
  constructor(private prisma: PrismaService) {}

  async execute(responsabilityId: number): Promise<void> {
    const now = new Date().toISOString();

    const responsability = await this.prisma.subjectResponsability.findUnique({
      where: { id: responsabilityId },
    });

    if (!responsability) {
      throw new NotFoundException('Reponsabilidade nao encontrada.');
    }
    if (responsability.id_status === 3) {
      throw new PreconditionFailedException('Reponsabilidade já finalizada.');
    }

    await this.prisma.subjectResponsability.update({
      where: { id: responsabilityId },
      data: { end_date: now, id_status: 3 },
    });
  }
}
