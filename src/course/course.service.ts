import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';

@Injectable()
export class CourseService {
  constructor(private prisma: PrismaService) {}

  findAll() {
    return this.prisma.course.findMany({
      select: {
        id: true,
        code: true,
        name: true,
      },
    });
  }

  async findCourseId(id: number) {
    const course_id = await this.prisma.course.findFirst({ where: { id: id } });
    return course_id;
  }
}
