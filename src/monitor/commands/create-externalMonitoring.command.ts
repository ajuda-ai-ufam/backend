import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';
import { CreateExternalMonitoringDto } from '../dto/external-monitoring.dto';
import { EmailService } from 'src/email/email.service';
import { UserService } from 'src/user/user.service';


@Injectable()
export class createExternalMonitoringCommand{
    constructor(private prisma: PrismaService,private emailService: EmailService, private useService: UserService) {}

    async execute(data: CreateExternalMonitoringDto): Promise<CreateExternalMonitoringDto> {
      const currentDate = new Date();
     
      if (data.start && data.start > currentDate) {
        throw new Error('A data de início deve ser menor ou igual à data atual.');
      }
  
      if (data.end && data.end > currentDate) {
        throw new Error('A data de término deve ser menor ou igual à data atual.');
      }
      const externalMonitoring= await this.prisma.externalMonitoring.create({ data: data });
       
      const monitor = await this.useService.findOneById(data.monitor_id);


      //const email: string = studentExternal.email;
      const emailMonitor: string = monitor.email;
      await this.emailService.sendEmailExternalMonitoring(emailMonitor);

      return externalMonitoring;
    }
  }
  