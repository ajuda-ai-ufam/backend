import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';
import { TopicFactory } from '../utils/topic.fatory';
import { GetTopicsResponse } from '../dto/get-topics.response.dto';
import { ScheduleTopicFormatter } from '../utils/schedule-topic-formatter';

@Injectable()
export class GetTopicsCommand {
  constructor(private prisma: PrismaService) {}

  async execute(
    name: string,
    page: number,
    pageSize: number,
  ): Promise<GetTopicsResponse> {
    let token: string;
    if (name) {
      token = ScheduleTopicFormatter.formatScheduleTopicToken(name);
    }

    const where = {
      token: { contains: token },
    };
    const take = pageSize || 10;
    const skip = page ? (page - 1) * take : 0;

    const response = await this.prisma.scheduleTopics.findMany({
      orderBy: {
        token: 'asc',
      },
      where,
      skip,
      take,
    });

    const totalItems = await this.prisma.scheduleTopics.count({ where });

    return {
      data: response.map(TopicFactory.createFromPrisma),
      meta: {
        page: page || 1,
        pageSize: take,
        totalItems,
        totalPages: Math.ceil(totalItems / take),
      },
    };
  }
}
