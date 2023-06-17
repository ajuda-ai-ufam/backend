import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';
import { Topic } from '../dto/topic.dto';
import { ScheduleTopicFormatter } from '../utils/schedule-topic-formatter';

@Injectable()
export class CreateTopicCommand {
  constructor(private prisma: PrismaService) {}

  async execute(name: string): Promise<Topic> {
    const formattedName = ScheduleTopicFormatter.formatScheduleTopicName(name);

    const token = ScheduleTopicFormatter.formatScheduleTopicToken(name);

    const topic = await this.prisma.scheduleTopics.create({
      data: {
        name: formattedName,
        token,
      },
    });

    return topic;
  }
}
