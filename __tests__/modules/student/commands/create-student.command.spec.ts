import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from 'src/database/prisma.service';
import { CreateStudentCommand } from 'src/student/commands/create-student.command';
import {
  prismaServiceMock,
  createStudentData,
} from './create-student.command.mock';
import { CreatePrismaFactory } from '__tests__/__utils__/factories/student.prisma.factory';
import { StudentDTO } from 'src/student/dto/student.dto';

describe('Test CreateStudentCommand', () => {
  let createScheduleCommand: CreateStudentCommand;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CreateStudentCommand,
        {
          provide: PrismaService,
          useValue: prismaServiceMock,
        },
      ],
    }).compile();

    createScheduleCommand =
      module.get<CreateStudentCommand>(CreateStudentCommand);
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should create a new student successfully', async () => {
    // GIVEN
    const userId = 1;
    const enrollment = '22222222';
    const courseId = 2;
    const contactEmail = 'estudante@icomp.ufam.edu.br';

    const dataNewStudent: StudentDTO = createStudentData(
      userId,
      enrollment,
      courseId,
      contactEmail,
    );
    const dataReturnNewStudent = CreatePrismaFactory.build(dataNewStudent);
    prismaServiceMock.student.create.mockReturnValueOnce(dataReturnNewStudent);

    // WHEN
    const dataStudentCreated = await createScheduleCommand.execute(
      dataNewStudent,
    );

    // THEN
    expect(prismaServiceMock.student.create).toBeCalledWith({
      data: dataNewStudent,
    });
    expect(dataStudentCreated).toBe(dataReturnNewStudent);
  });
});
