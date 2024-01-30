import { ScheduleStatus } from "src/schedules/utils/schedules.enum";
import scheduleSelectPrismaSQL from "src/schedules/utils/select-schedule.prisma-sql";

const now = new Date();
const AMT_OFFSET = -4;
now.setHours(now.getHours() + AMT_OFFSET);

export const prismaServiceMock = {
    scheduleMonitoring: {
      findMany: jest.fn(),
    },
  };

export const expectedFindMany = (monitorUserId: number) => {
  const now = new Date();
  const AMT_OFFSET = -4;
  now.setHours(now.getHours() + AMT_OFFSET);

  return {
    select: scheduleSelectPrismaSQL,
    orderBy: {
      end: 'asc',
    },
    where: {
      id_status: ScheduleStatus.CONFIRMED,
      end: {
        lte: now.toISOString(),
      },
      monitor: {
        student: {
          user: {
            id: monitorUserId,
          },
        },
      },
    },
  };
};

