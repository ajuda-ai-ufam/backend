import { ScheduleStatus } from 'src/schedules/utils/schedules.enum';

export const emailServiceMock = {
  sendEmailCancelMonitoring: jest.fn(),
};

export const prismaServiceMock = {
  scheduleMonitoring: {
    findUnique: jest.fn(),
    update: jest.fn(),
  },
};

export const scheduleMonitoringFindUniqueExpectedCall = (
  scheduleId: number,
) => ({
  where: { id: scheduleId },
  include: {
    monitor: { include: { student: { include: { user: true } } } },
    status: true,
    student: { include: { user: true } },
  },
});

export const scheduleMonitoringUpdateExpectedCall = (scheduleId: number) => ({
  data: { id_status: ScheduleStatus.CANCELED },
  where: { id: scheduleId },
});
