import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';
import { MonitorStatus } from 'src/monitor/utils/monitor.enum';
import {
  AlreadyFinishedException,
  BlockingMonitorsException,
  ResponsabilityNotFoundException,
} from '../utils/exceptions';
import { CoordinatorIsNotFromDepartment } from 'src/teacher/utils/exceptions';
import { SubjectResponsabilityStatus } from '../utils/subject.enum';
import { JWTUserDTO } from 'src/teacher/dto/user-token.dto';

@Injectable()
export class EndResponsabilityCommand {
  constructor(private prisma: PrismaService) {}

  async execute(userData: JWTUserDTO, responsabilityId: number): Promise<void> {
    const AMT_OFFSET_IN_MS = -4 * 60 * 60 * 1000;
    const now = new Date();
    const nowAMT = new Date(now.getTime() + AMT_OFFSET_IN_MS).toISOString();

    const responsability = await this.prisma.subjectResponsability.findUnique({
      where: { id: responsabilityId },
      include: {
        subject: true,
      },
    });

    if (
      userData.department == undefined ||
      userData.department.id != responsability.subject.department_id
    ) {
      throw new CoordinatorIsNotFromDepartment();
    }

    if (!responsability) {
      throw new ResponsabilityNotFoundException();
    }

    const blockingMonitors = await this.prisma.monitor.findMany({
      include: {
        status: true,
      },

      where: {
        responsible_professor_id: responsability.professor_id,
        subject_id: responsability.subject_id,
        id_status: {
          in: [
            MonitorStatus.PENDING,
            MonitorStatus.APPROVED,
            MonitorStatus.AVAILABLE,
          ],
        },
      },
    });

    if (blockingMonitors.length) {
      throw new BlockingMonitorsException(blockingMonitors);
    }
    if (responsability.id_status === SubjectResponsabilityStatus.FINISHED) {
      throw new AlreadyFinishedException();
    }

    await this.prisma.subjectResponsability.update({
      where: { id: responsabilityId },
      data: {
        end_date: nowAMT,
        id_status: SubjectResponsabilityStatus.FINISHED,
      },
    });
  }
}
