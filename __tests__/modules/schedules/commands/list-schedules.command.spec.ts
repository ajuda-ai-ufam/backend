import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from 'src/database/prisma.service';
import {prismaServiceMock,expectedFindMany, expectedCount} from './list-schedules.command.mock';
import { SchedulePrismaFactory } from '__tests__/__utils__/factories/schedule.prisma.factory';
import { ListSchedulesCommand } from 'src/schedules/commands/list-schedules.command';
import { ListSchedulesQueryParams } from 'src/schedules/dto/list-schedules.request.dto';
import { ScheduleStatus } from 'src/schedules/utils/schedules.enum';
import { Role } from 'src/auth/enums/role.enum';
import { ScheduleFactory } from 'src/schedules/utils/schedule.factory';
import { ProfessorNotAuthorizedException } from 'src/schedules/utils/exceptions';

describe('Test ListSchedulesCommand', () => {
  let listSchedulesCommand: ListSchedulesCommand;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ListSchedulesCommand,
        {
          provide: PrismaService,
          useValue: prismaServiceMock,
        },
      ],
    }).compile();

    listSchedulesCommand = module.get<ListSchedulesCommand>(ListSchedulesCommand);
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should list schedules based on query parameters for a professor', async () => {
    // GIVEN
    const query: ListSchedulesQueryParams = {
        startDate: new Date('2023-01-01'),
        endDate: new Date('2023-02-01'),
        page: 1,
        pageSize: 10,
        status: ScheduleStatus.CONFIRMED,
        subjectIds: [1, 2, 3],
        responsibleIds:[],
        studentName: 'John Doe',
        studentEnrollment: '123456789',
      };

    const userId = 1;
    const userRole = Role.Professor;


    const mockSchedules = SchedulePrismaFactory.build({});
    const mockFindManyResponse = [mockSchedules];
    prismaServiceMock.scheduleMonitoring.findMany.mockResolvedValueOnce(mockFindManyResponse);

    prismaServiceMock.scheduleMonitoring.count.mockResolvedValueOnce(20);

    // WHEN
    await listSchedulesCommand.execute(query, userId, userRole);

    // THEN
    expect(prismaServiceMock.scheduleMonitoring.findMany).toBeCalledWith(
      expectedFindMany(query,query.responsibleIds),
    );
    
    expect(prismaServiceMock.scheduleMonitoring.count).toHaveBeenCalledWith(
      expectedCount(query,query.responsibleIds),
    );

  });

  it('should throw ProfessorNotAuthorizedException for a professor with responsibleIds', async () => {
    //GIVEN
    const query: ListSchedulesQueryParams = {
      startDate: new Date('2023-01-01'),
      endDate: new Date('2023-02-01'),
      page: 1,
      pageSize: 10,
      status: ScheduleStatus.CONFIRMED,
      subjectIds: [1, 2, 3],
      responsibleIds: [1],
      studentName: 'John Doe',
      studentEnrollment: '123456789',
    };

    const userId = 1;
    const userRole = Role.Professor;
    let error;
    let success = false;

    //WHEN
    try {
      await (listSchedulesCommand.execute(query, userId, userRole));
      success = true;
    } catch (e) {
      error = e;
    }

    //THEN
    expect(success).toBeFalsy();
    expect(error).toBeInstanceOf(ProfessorNotAuthorizedException);
    expect(prismaServiceMock.scheduleMonitoring.findMany).not.toHaveBeenCalled();
    expect(prismaServiceMock.scheduleMonitoring.count).not.toHaveBeenCalled();
  });


});