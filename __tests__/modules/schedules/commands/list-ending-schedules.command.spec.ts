import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from 'src/database/prisma.service';
import {prismaServiceMock,expectedFindMany} from './list-ending-schedules.command.mock';
import { ListEndingSchedulesCommand } from 'src/schedules/commands/list-ending-schedules.command';
import { SchedulePrismaFactory } from '__tests__/__utils__/factories/schedule.prisma.factory';

describe('Test ListEndingSchedulesCommand', () => {
  let listEndingSchedulesCommand: ListEndingSchedulesCommand;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ListEndingSchedulesCommand,
        {
          provide: PrismaService,
          useValue: prismaServiceMock,
        },
      ],
    }).compile();

    listEndingSchedulesCommand = module.get<ListEndingSchedulesCommand>(ListEndingSchedulesCommand);
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

it('should list ending schedules for a monitor user', async () => {
  // GIVEN
  const scheduleList = SchedulePrismaFactory.build({});
  const mockFindManyResponse = [scheduleList];
  
  prismaServiceMock.scheduleMonitoring.findMany.mockResolvedValueOnce(mockFindManyResponse);

  const userId = scheduleList.monitor.student.user.id;

  // WHEN
  await listEndingSchedulesCommand.execute(userId);

  // THEN
  expect(prismaServiceMock.scheduleMonitoring.findMany).toHaveBeenCalledWith(
    expect.objectContaining({
      where: expect.objectContaining({
        end: expect.objectContaining({
          lte: expect.any(String),
        }),
      }),
    })
  );
});
});
