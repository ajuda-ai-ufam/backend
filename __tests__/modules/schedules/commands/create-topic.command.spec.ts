import { CreateTopicCommand } from 'src/schedules/commands/create-topic.command';
import { PrismaService } from 'src/database/prisma.service';
import { SchedulePrismaFactory } from '__tests__/__utils__/factories/schedule.prisma.factory';
import { ScheduleStatus } from 'src/schedules/utils/schedules.enum';
import { Test, TestingModule } from '@nestjs/testing';
import { prismaServiceMock } from './create-topic.command.mock';
import { TopicFactory } from '__tests__/__utils__/factories/topic.prisma.factory';

describe('Test CreateTopicCommand', () => {
  let createTopicCommand: CreateTopicCommand;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CreateTopicCommand,
        {
          provide: PrismaService,
          useValue: prismaServiceMock,
        },
      ],
    }).compile();

    createTopicCommand = module.get<CreateTopicCommand>(
      CreateTopicCommand,
    );
  });
  
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should create a topic', async () => {
    // GIVEN
    const topicProps = TopicFactory.build({});
    prismaServiceMock.scheduleTopics.create.mockResolvedValue(
      topicProps,
    );

    const topicName = topicProps.name;
     
    // WHEN
    await createTopicCommand.execute(topicName);
  
    // THEN
    expect(prismaServiceMock.scheduleTopics.create).toHaveBeenCalledWith({
      data: topicProps,
    });
  });
});
