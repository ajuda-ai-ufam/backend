import { Topic } from '../domain/topic';

export class TopicFactory {
  static createFromPrisma(prismaTopic): Topic {
    const topic: Topic = {
      id: prismaTopic.id,
      name: prismaTopic.name,
      token: prismaTopic.token,
    };

    return topic;
  }
}
