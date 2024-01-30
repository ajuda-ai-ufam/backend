import { ScheduleStatus } from 'src/schedules/utils/schedules.enum';

export const prismaServiceMock = {
    scheduleMonitoring: {
      findUnique: jest.fn(),
      update: jest.fn(),
    },
  };

  export const expectedFindUniqueCall  = (scheduleId: number,
    ) => ({
    where:{ id: scheduleId },
    include: { monitor: true, status: true },
  });

  export const expectedUpdateCall  = (scheduleId: number,
    ) => ({
        data: { id_status: ScheduleStatus.REALIZED},
        where:{ id: scheduleId },
    });