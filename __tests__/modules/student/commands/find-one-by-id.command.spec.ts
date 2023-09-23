import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from 'src/database/prisma.service';
import { FindOneByIdCommand } from 'src/student/commands/find-one-by-id.command';
import { prismaServiceMock } from './find-one-by-id.command.mock';
import { FindStudentFactory } from '__tests__/__utils__/factories/student.prisma.factory';

describe('Test FindOneByIdCommand', () => {
  let findOneByIdCommand: FindOneByIdCommand;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FindOneByIdCommand,
        {
          provide: PrismaService,
          useValue: prismaServiceMock,
        },
      ],
    }).compile();

    findOneByIdCommand = module.get<FindOneByIdCommand>(FindOneByIdCommand);
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should find a student by user_id successfully', async () => {
    // GIVEN
    const dataStudentByUserId = FindStudentFactory.build({});
    prismaServiceMock.student.findUnique.mockReturnValueOnce(
      dataStudentByUserId,
    );

    const userId = dataStudentByUserId.user_id;

    // WHEN
    const dataReturnStudent = await findOneByIdCommand.execute(userId);

    // THEN
    expect(prismaServiceMock.student.findUnique).toBeCalledWith({
      where: { user_id: userId },
    });
    expect(dataReturnStudent).toBe(dataStudentByUserId);
  });
});
