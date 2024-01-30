import { ScheduleStatus } from "src/schedules/utils/schedules.enum";
import scheduleSelectPrismaSQL from "src/schedules/utils/select-schedule.prisma-sql";
import { ListSchedulesQueryParams } from 'src/schedules/dto/list-schedules.request.dto';

export const prismaServiceMock = {
    scheduleMonitoring: {
      findMany: jest.fn(),
      count: jest.fn(),
    },
  };
  
  export const expectedCount = (query: ListSchedulesQueryParams,responsibleIds: number[]) => ({
    where: {
      id_status: query.status,
      start: {
        gte: query.startDate,
        lte: query.endDate,
      },
      AND: [
        {
          OR: [
            {
              student: {
                enrollment: query.studentEnrollment,
              },
            },
            {
              monitor: {
                student: {
                  enrollment: query.studentEnrollment,
                },
              },
            },
          ],
        },
        {
          OR: [
            {
              student: {
                user: {
                  name: {
                    contains: query.studentName,
                  },
                },
              },
            },
            {
              monitor: {
                student: {
                  user: {
                    name: {
                      contains: query.studentName,
                    },
                  },
                },
              },
            },
          ],
        },
      ],
      monitor: {
        responsible_professor_id: {
          in: responsibleIds.length ? responsibleIds : undefined,
        },
        subject_id: {
          in: query.subjectIds,
        },
      },
    },
  });

  export const expectedFindMany = (query: ListSchedulesQueryParams, responsibleIds: number[]): any => ({
    select: scheduleSelectPrismaSQL,
    orderBy: {
      start: query.startDate ? 'asc' : 'desc',
    },
    where: {
      id_status: query.status,
      start: {
        gte: expect.any(Date),
        lte: expect.any(Date),
      },
      AND: [
        {
          OR: [
            {
              student: {
                enrollment: query.studentEnrollment,
              },
            },
            {
              monitor: {
                student: {
                  enrollment: query.studentEnrollment,
                },
              },
            },
          ],
        },
        {
          OR: [
            {
              student: {
                user: {
                  name: {
                    contains: query.studentName,
                  },
                },
              },
            },
            {
              monitor: {
                student: {
                  user: {
                    name: {
                      contains: query.studentName,
                    },
                  },
                },
              },
            },
          ],
        },
      ],
      monitor: {
        responsible_professor_id: {
          in: responsibleIds.length ? responsibleIds : undefined,
        },
        subject_id: {
          in: query.subjectIds,
        },
      },
    },
      skip:0,
      take:10
  });