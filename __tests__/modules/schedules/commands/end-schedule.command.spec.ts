import { Test, TestingModule } from "@nestjs/testing";
import { EndScheduleCommand } from "src/schedules/commands/end-schedule.command"
import { expectedFindUniqueCall, expectedUpdateCall, prismaServiceMock } from "./end-schedule.command.mock";
import { PrismaService } from 'src/database/prisma.service';
import { SchedulePrismaFactory } from "__tests__/__utils__/factories/schedule.prisma.factory";
import {
    InvalidScheduleStatusException,
    NotTheScheduleMonitorException,
    ScheduleNotFoundException,
    NotFinalizedScheduleException,

  } from 'src/schedules/utils/exceptions';
import { ScheduleStatus } from 'src/schedules/utils/schedules.enum';
describe ('Test endScheduleCommand ',() => {
    let endScheduleCommand: EndScheduleCommand;

    beforeAll(async () => {
        const module: TestingModule = await Test.createTestingModule({
          providers: [
            EndScheduleCommand,
            {
              provide: PrismaService,
              useValue: prismaServiceMock,
            },
          ],
        }).compile();

        endScheduleCommand = module.get<EndScheduleCommand>(
            EndScheduleCommand,
        );
    });
    beforeEach(() => {
        jest.clearAllMocks();
      });
      
      it('should end a schedule', async () => {
        // GIVEN
        const endSchedule = SchedulePrismaFactory.build({});
        prismaServiceMock.scheduleMonitoring.findUnique.mockReturnValueOnce(
          endSchedule,
        );

        const scheduleId = endSchedule.id;
        const userId = endSchedule.monitor.student.user.id;
    
        // WHEN
        await endScheduleCommand.execute(scheduleId,userId,true);

        //THEN
        expect(prismaServiceMock.scheduleMonitoring.update).toHaveBeenCalledWith(expectedUpdateCall(endSchedule.id));

        expect(prismaServiceMock.scheduleMonitoring.findUnique).toHaveBeenCalledWith(expectedFindUniqueCall(endSchedule.id));
    })

      it('should raise ScheduleNotFoundException when shedule doesnt exit', async () => {
        // GIVEN
        const scheduleId = 1;
        const userId = 1;
        let error;
        let success = false;
        

        //WHEN
        try {
            await endScheduleCommand.execute(scheduleId, userId,true);
            success = true;
          } catch (e) {
            error = e;
          }
        
        //THEN
        expect(success).toBeFalsy();
        expect(error).toBeInstanceOf(ScheduleNotFoundException);
        expect(prismaServiceMock.scheduleMonitoring.findUnique).toBeCalledWith(
          expectedFindUniqueCall(scheduleId),
        );
        expect(prismaServiceMock.scheduleMonitoring.update).not.toBeCalled();

      });

      it('should throw NotTheScheduleMonitorException when the user is not the monitor', async () => {
        // GIVEN
        const confirmedSchedule = SchedulePrismaFactory.build({});
        prismaServiceMock.scheduleMonitoring.findUnique.mockReturnValueOnce(
          confirmedSchedule,
        );
    
        const scheduleId = confirmedSchedule.id;
        const userId = confirmedSchedule.monitor.student.user.id+10;
        let error;
        let success = false;
    
    
        // WHEN
        try {
          await endScheduleCommand.execute(scheduleId, userId,true);
          success = true;
        } catch (e) {
          error = e;
        }
        //THEN
        expect(success).toBeFalsy();
        expect(error).toBeInstanceOf(NotTheScheduleMonitorException);
        expect(prismaServiceMock.scheduleMonitoring.findUnique).toBeCalledWith(
          expectedFindUniqueCall(scheduleId),
        );
        expect(prismaServiceMock.scheduleMonitoring.update).not.toBeCalled();
      });

    it('should raise InvalidScheduleStatusException when schedule status is not CONFIRMED', async () => {
      // GIVEN
      const endSchedule = SchedulePrismaFactory.build({
        id_status: ScheduleStatus.CANCELED,
        status: {
          id: ScheduleStatus.CANCELED,
          status: 'Cancelada',
        },
      });
      prismaServiceMock.scheduleMonitoring.findUnique.mockReturnValue(
        endSchedule,
      );

      const scheduleId = endSchedule.id;
      const userId = endSchedule.monitor.student.user.id;
      let error;
      let success = false;

      // WHEN
      try {
        await endScheduleCommand.execute(scheduleId, userId,true);
        success = true;
      } catch (e) {
        error = e;
      }

      //THEN
      expect(success).toBeFalsy();
      expect(error).toBeInstanceOf(InvalidScheduleStatusException);
      expect(prismaServiceMock.scheduleMonitoring.findUnique).toBeCalledWith(
        expectedFindUniqueCall(scheduleId),
      );
      expect(prismaServiceMock.scheduleMonitoring.update).not.toBeCalled();
    });
    
    it('should raise NotFinalizedScheduleException when schedule end is in the future', async () => {
      // GIVEN

    
      const futureEndSchedule = SchedulePrismaFactory.build({
        end: new Date('2024-12-31T23:59:59.999Z'),
      });
      prismaServiceMock.scheduleMonitoring.findUnique.mockReturnValueOnce(futureEndSchedule);

      const scheduleId = futureEndSchedule.id;
      const userId = futureEndSchedule.monitor.student.user.id;
      let error;
      let success = false;
    
      // WHEN
      try {
        await endScheduleCommand.execute(scheduleId, userId,true);
        success = true;
      } catch (e) {
        error = e;
      }
  
      //THEN
      expect(success).toBeFalsy();
      expect(error).toBeInstanceOf(NotFinalizedScheduleException);
      expect(prismaServiceMock.scheduleMonitoring.findUnique).toBeCalledWith(
        expectedFindUniqueCall(scheduleId),
      );
      expect(prismaServiceMock.scheduleMonitoring.update).not.toBeCalled();
    });
    
      
});