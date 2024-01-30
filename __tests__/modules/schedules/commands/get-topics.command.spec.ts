import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from 'src/database/prisma.service';
import {expectedCount, expectedFindMany, prismaServiceMock} from './get-topics.command.mock';
import { GetTopicsCommand } from 'src/schedules/commands/get-topics.command';
import { TopicFactory} from '__tests__/__utils__/factories/topic.prisma.factory';
import { getTopic } from '__tests__/__utils__/factories/topic.prisma.factory';

describe('Test GetTopicsCommand', () => {
  let getTopicsCommand: GetTopicsCommand;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GetTopicsCommand,
        {
          provide: PrismaService,
          useValue: prismaServiceMock,
        },
      ],
    }).compile();

    getTopicsCommand = module.get<GetTopicsCommand>(GetTopicsCommand);
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should get topics with pagination', async () => {
    // GIVEN
    const topicPage = getTopic.build({});
  
    const mockFindManyResponse = [topicPage];
  
    prismaServiceMock.scheduleTopics.findMany.mockResolvedValueOnce(mockFindManyResponse);
  
    prismaServiceMock.scheduleTopics.count.mockResolvedValueOnce(mockFindManyResponse);
  
    // WHEN
    await getTopicsCommand.execute(topicPage.name, topicPage.page, topicPage.pageSize);
  
    // THEN
    expect(prismaServiceMock.scheduleTopics.findMany).toHaveBeenCalledWith(
      expectedFindMany(topicPage.name, topicPage.page, topicPage.pageSize)
    );
  
    expect(prismaServiceMock.scheduleTopics.count).toHaveBeenCalledWith(
      expectedCount(topicPage.name)
    );
  });

});
