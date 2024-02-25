import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';
import { CreateExternalMonitoringDto } from '../dto/external-monitoring.dto';

@Injectable()
export class createExternalMonitoringCommand{
    constructor(private prisma: PrismaService) {}

    async execute(data: CreateExternalMonitoringDto): Promise<CreateExternalMonitoringDto> {
      const currentDate = new Date();

      if (data.start && data.start > currentDate) {
        throw new Error('A data de início deve ser menor ou igual à data atual.');
      }
  
      if (data.end && data.end > currentDate) {
        throw new Error('A data de término deve ser menor ou igual à data atual.');
      }

      if (!data.student_name){
        throw new Error('O nome do estudante é obrigatório.');
      }

      if (data.student_id){
        const student = await this.prisma.student.findUnique({
          where: {
            user_id: data.student_id,
          },
        });
  
        if (!student) {
          throw new NotFoundException('Estudante não encontrado.');
        }
      }

      const monitor = await this.prisma.monitor.findUnique({
        where: {
          id: data.monitor_id,
        },
      });

      if (!monitor) {
        throw new NotFoundException('Monitor não encontrado.');
      }

      if (monitor.responsible_professor_id !== data.professor_id) {
        throw new Error('O professor não é responsável por esse monitor.');
      }
      
      const teacher = await this.prisma.teacher.findUnique({
        where: {
          user_id: data.professor_id,
        },
      });

      if (!teacher) {
        throw new NotFoundException('Professor não encontrado.');
      }
      
      if (data.schedule_topic_id && data.schedule_topic_id > 0) {
        const schedule_topic = await this.prisma.scheduleTopics.findUnique({
          where: {
            id: data.schedule_topic_id,
          },
        });
        if (!schedule_topic) {
          throw new NotFoundException('Tópico de agendamento não encontrado.');
        }
      }

      const externalMonitoring= await this.prisma.externalMonitoring.create({ data: data });

      return externalMonitoring;
    }
  }
  