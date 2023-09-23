import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from 'src/database/prisma.service';
import { GetMonitorAvailabilityCommand } from 'src/student/commands/get-monitor-availability.command';
import {
  prismaServiceMock,
  getMonitorAvailabilityExpectedCall,
} from './get-monitor-availability.command.mock';
import { GetMonitorAvailability } from '__tests__/__utils__/factories/student.prisma.factory';

describe('Test GetMonitorAvailabilityCommand', () => {
  let getMonitorAvailabilityCommand: GetMonitorAvailabilityCommand;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GetMonitorAvailabilityCommand,
        {
          provide: PrismaService,
          useValue: prismaServiceMock,
        },
      ],
    }).compile();

    getMonitorAvailabilityCommand = module.get<GetMonitorAvailabilityCommand>(
      GetMonitorAvailabilityCommand,
    );
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should find monitor availability by monitor_id successfully', async () => {
    // GIVEN
    const dataMonitorAvailability = GetMonitorAvailability.build({});
    prismaServiceMock.availableTimes.findMany.mockReturnValueOnce(
      dataMonitorAvailability,
    );

    const monitorId = dataMonitorAvailability.id;

    // WHEN
    const dataReturnMonitor = await getMonitorAvailabilityCommand.execute(
      monitorId,
    );

    // THEN
    expect(prismaServiceMock.availableTimes.findMany).toBeCalledWith(
      getMonitorAvailabilityExpectedCall(monitorId),
    );
    expect(dataReturnMonitor).toBe(dataMonitorAvailability);
  });
});
