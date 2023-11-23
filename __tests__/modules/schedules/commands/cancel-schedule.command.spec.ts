import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from 'src/database/prisma.service';
import { EmailService } from 'src/email/email.service';
import { CancelScheduleCommand } from 'src/schedules/commands/cancel-schedule.command';
import {
  InvalidScheduleStatusException,
  NotTheScheduleParticipantException,
  ScheduleNotFoundException,
} from 'src/schedules/utils/exceptions';
import {
  emailServiceMock,
  prismaServiceMock,
  scheduleMonitoringFindUniqueExpectedCall,
  scheduleMonitoringUpdateExpectedCall,
} from './cancel-schedule.command.mock';
import { SchedulePrismaFactory } from '__tests__/__utils__/factories/schedule.prisma.factory';
import { ScheduleStatus } from 'src/schedules/utils/schedules.enum';

describe('Test CancelScheduleCommand', () => {
  let cancelScheduleCommand: CancelScheduleCommand;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CancelScheduleCommand,
        {
          provide: PrismaService,
          useValue: prismaServiceMock,
        },
        {
          provide: EmailService,
          useValue: emailServiceMock,
        },
      ],
    }).compile();

    cancelScheduleCommand = module.get<CancelScheduleCommand>(
      CancelScheduleCommand,
    );
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should cancel schedule by student successfuly', async () => {
    // GIVEN
    const confirmedSchedule = SchedulePrismaFactory.build({});
    prismaServiceMock.scheduleMonitoring.findUnique.mockReturnValueOnce(
      confirmedSchedule,
    );

    const scheduleId = confirmedSchedule.id;
    const userId = confirmedSchedule.monitor.student.user.id;

    // WHEN
    await cancelScheduleCommand.execute(scheduleId, userId);

    // THEN
    expect(prismaServiceMock.scheduleMonitoring.findUnique).toBeCalledWith(
      scheduleMonitoringFindUniqueExpectedCall(scheduleId),
    );
    expect(prismaServiceMock.scheduleMonitoring.update).toBeCalledWith(
      scheduleMonitoringUpdateExpectedCall(scheduleId),
    );
    expect(emailServiceMock.sendEmailCancelMonitoring).toBeCalledWith(
      confirmedSchedule.monitor.student.user.email,
      process.env.CANCEL_MONITORING_SENDER,
      {
        name: confirmedSchedule.student.user.name,
        date: confirmedSchedule.start.toLocaleDateString('pt-BR'),
        start: confirmedSchedule.start.toLocaleTimeString('pt-BR').slice(0, 5),
        end: confirmedSchedule.end.toLocaleTimeString('pt-BR').slice(0, 5),
      },
      'schedule_cancel_sender_confirmation',
    );
    expect(emailServiceMock.sendEmailCancelMonitoring).toBeCalledWith(
      confirmedSchedule.student.user.email,
      process.env.CANCEL_MONITORING_SENDER,
      {
        name: confirmedSchedule.monitor.student.user.name,
        date: confirmedSchedule.start.toLocaleDateString('pt-BR'),
        start: confirmedSchedule.start.toLocaleTimeString('pt-BR').slice(0, 5),
        end: confirmedSchedule.end.toLocaleTimeString('pt-BR').slice(0, 5),
      },
      'schedule_cancel_recipient_confirmation',
    );
  });

  it('should cancel schedule by monitor successfuly', async () => {
    // GIVEN
    const confirmedSchedule = SchedulePrismaFactory.build({});
    prismaServiceMock.scheduleMonitoring.findUnique.mockReturnValueOnce(
      confirmedSchedule,
    );

    const scheduleId = confirmedSchedule.id;
    const userId = confirmedSchedule.student_id;

    // WHEN
    await cancelScheduleCommand.execute(scheduleId, userId);

    // THEN
    expect(prismaServiceMock.scheduleMonitoring.findUnique).toBeCalledWith(
      scheduleMonitoringFindUniqueExpectedCall(scheduleId),
    );
    expect(prismaServiceMock.scheduleMonitoring.update).toBeCalledWith(
      scheduleMonitoringUpdateExpectedCall(scheduleId),
    );
    expect(emailServiceMock.sendEmailCancelMonitoring).toBeCalledWith(
      confirmedSchedule.student.user.email,
      process.env.CANCEL_MONITORING_SENDER,
      {
        name: confirmedSchedule.monitor.student.user.name,
        date: confirmedSchedule.start.toLocaleDateString('pt-BR'),
        start: confirmedSchedule.start.toLocaleTimeString('pt-BR').slice(0, 5),
        end: confirmedSchedule.end.toLocaleTimeString('pt-BR').slice(0, 5),
      },
      'schedule_cancel_sender_confirmation',
    );
    expect(emailServiceMock.sendEmailCancelMonitoring).toBeCalledWith(
      confirmedSchedule.monitor.student.user.email,
      process.env.CANCEL_MONITORING_SENDER,
      {
        name: confirmedSchedule.student.user.name,
        date: confirmedSchedule.start.toLocaleDateString('pt-BR'),
        start: confirmedSchedule.start.toLocaleTimeString('pt-BR').slice(0, 5),
        end: confirmedSchedule.end.toLocaleTimeString('pt-BR').slice(0, 5),
      },
      'schedule_cancel_recipient_confirmation',
    );
  });

  it('should raise ScheduleNotFoundException when there is no schedule with the given ID', async () => {
    // GIVEN
    const scheduleId = 1;
    const userId = 1;
    let error;
    let success = false;

    // WHEN
    try {
      await cancelScheduleCommand.execute(scheduleId, userId);
      success = true;
    } catch (e) {
      error = e;
    }

    //THEN
    expect(success).toBeFalsy();
    expect(error).toBeInstanceOf(ScheduleNotFoundException);
    expect(prismaServiceMock.scheduleMonitoring.findUnique).toBeCalledWith(
      scheduleMonitoringFindUniqueExpectedCall(scheduleId),
    );
    expect(prismaServiceMock.scheduleMonitoring.update).not.toBeCalled();
    expect(emailServiceMock.sendEmailCancelMonitoring).not.toBeCalled();
  });

  it("should raise NotTheScheduleParticipantException when the monitoring is not the user's", async () => {
    // GIVEN
    const confirmedSchedule = SchedulePrismaFactory.build({});
    prismaServiceMock.scheduleMonitoring.findUnique.mockReturnValue(
      confirmedSchedule,
    );

    const scheduleId = confirmedSchedule.id;
    const userId = confirmedSchedule.student_id + 100;
    let error;
    let success = false;

    // WHEN
    try {
      await cancelScheduleCommand.execute(scheduleId, userId);
      success = true;
    } catch (e) {
      error = e;
    }

    //THEN
    expect(success).toBeFalsy();
    expect(error).toBeInstanceOf(NotTheScheduleParticipantException);
    expect(prismaServiceMock.scheduleMonitoring.findUnique).toBeCalledWith(
      scheduleMonitoringFindUniqueExpectedCall(scheduleId),
    );
    expect(prismaServiceMock.scheduleMonitoring.update).not.toBeCalled();
    expect(emailServiceMock.sendEmailCancelMonitoring).not.toBeCalled();
  });

  it('should raise InvalidScheduleStatusException when the monitoring is not confirmed', async () => {
    // GIVEN
    const canceledSchedule = SchedulePrismaFactory.build({
      id_status: ScheduleStatus.CANCELED,
      status: {
        id: ScheduleStatus.CANCELED,
        status: 'Cancelada',
      },
    });
    prismaServiceMock.scheduleMonitoring.findUnique.mockReturnValue(
      canceledSchedule,
    );

    const scheduleId = canceledSchedule.id;
    const userId = canceledSchedule.student_id;
    let error;
    let success = false;

    // WHEN
    try {
      await cancelScheduleCommand.execute(scheduleId, userId);
      success = true;
    } catch (e) {
      error = e;
    }

    //THEN
    expect(success).toBeFalsy();
    expect(error).toBeInstanceOf(InvalidScheduleStatusException);
    expect(prismaServiceMock.scheduleMonitoring.findUnique).toBeCalledWith(
      scheduleMonitoringFindUniqueExpectedCall(scheduleId),
    );
    expect(prismaServiceMock.scheduleMonitoring.update).not.toBeCalled();
    expect(emailServiceMock.sendEmailCancelMonitoring).not.toBeCalled();
  });
});
