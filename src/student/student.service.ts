import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
  PreconditionFailedException,
} from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';
import { ScheduleMonitoringDto } from './dto/schedule-monitoring.dto';
import { StudentDTO } from './dto/student.dto';
import * as moment from 'moment';

@Injectable()
export class StudentService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: StudentDTO) {
    const student = await this.prisma.student.create({ data: data });
    return student;
  }

  async findEnrollment(enrollment: string) {
    const user_enrollment = await this.prisma.student.findFirst({
      where: { enrollment: enrollment },
    });
    return user_enrollment;
  }

  async findOneById(id: number) {
    const user_student = await this.prisma.student.findUnique({
      where: { user_id: id },
    });
    return user_student;
  }

  async scheduleMonitoring(id: number, data: ScheduleMonitoringDto) {
    const user = await this.findOneById(id);
    if (!user) throw new ForbiddenException('Aluno não encontrado');

    const monitor = await this.prisma.monitor.findFirst({
      where: { student_id: data.monitor_id },
    });
    if (!monitor) throw new ForbiddenException('Monitor não encontrado');

    if (user.user_id === monitor.student_id)
      throw new PreconditionFailedException(
        'Não foi possível agendar a monitoria, aluno e monitor são o mesmo usuário',
      );

    if (!moment(data.start).isBefore(moment(data.end)))
      throw new BadRequestException(
        'Data de início deve ser anterior a data de término',
      );

    await this.prisma.scheduleMonitoring.create({
      data: {
        student_id: id,
        monitor_id: monitor.id,
        start: data.start,
        end: data.end,
      },
    });
    return { message: 'Monitoria agendada com sucesso' };
  }
}
