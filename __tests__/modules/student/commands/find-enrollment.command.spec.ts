import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from 'src/database/prisma.service';
import { FindEnrollmentCommand } from 'src/student/commands/find-enrollment.command';
import { prismaServiceMock } from './find-enrollment.command.mock';
import { FindStudentFactory } from '__tests__/__utils__/factories/student.prisma.factory';

describe('Test FindEnrollmentCommand', () => {
  let findEnrollmentCommand: FindEnrollmentCommand;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FindEnrollmentCommand,
        {
          provide: PrismaService,
          useValue: prismaServiceMock,
        },
      ],
    }).compile();

    findEnrollmentCommand = module.get<FindEnrollmentCommand>(
      FindEnrollmentCommand,
    );
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should find a student by enrollment successfully', async () => {
    // GIVEN
    const dataStudentByEnrollment = FindStudentFactory.build({});
    prismaServiceMock.student.findFirst.mockReturnValueOnce(
      dataStudentByEnrollment,
    );

    const enrollment = dataStudentByEnrollment.enrollment;

    // WHEN
    const dataReturnStudent = await findEnrollmentCommand.execute(enrollment);

    // THEN
    expect(prismaServiceMock.student.findFirst).toBeCalledWith({
      where: { enrollment: enrollment },
    });
    expect(dataReturnStudent).toBe(dataStudentByEnrollment);
  });
});
