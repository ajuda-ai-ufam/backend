import { Test, TestingModule } from '@nestjs/testing';
import { SchedulesController } from 'src/schedules/schedules.controller';
import { CancelScheduleCommand } from 'src/schedules/commands/cancel-schedule.command';
import { EndScheduleCommand } from 'src/schedules/commands/end-schedule.command';
import { ListEndingSchedulesCommand } from 'src/schedules/commands/list-ending-schedules.command';
import { JwtService } from '@nestjs/jwt';
import { SchedulePrismaFactory } from '__tests__/__utils__/factories/schedule.prisma.factory';
import {
    Body,
    Controller,
    ForbiddenException,
    Get,
    HttpCode,
    HttpStatus,
    NotFoundException,
    Param,
    Post,
    PreconditionFailedException,
    Query,
    Req,
  } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';
import{prismaServiceMock,emailServiceMock}from'__tests__/modules/schedules/commands/cancel-schedule.command.mock'
import { EmailService } from 'src/email/email.service';
import { GetTopicsCommand } from 'src/schedules/commands/get-topics.command';
import { ListSchedulesCommand } from 'src/schedules/commands/list-schedules.command';
import { CreateTopicCommand } from 'src/schedules/commands/create-topic.command';
import { createTopicCommandMock,listSchedulesCommandMock,getTopicsCommandMock,
  listEndingSchedulesCommandMock,endScheduleCommandMock} from './schedules.controller.mock';
import { TopicFactory } from '__tests__/__utils__/factories/topic.prisma.factory';
import { ScheduleNotFoundException } from 'src/schedules/utils/exceptions';

describe('Test SchedulesController', () => {
  let schedulesController: SchedulesController;
  let cancelScheduleCommand: CancelScheduleCommand;
  let endScheduleCommand: EndScheduleCommand;
  let listEndingSchedulesCommand: ListEndingSchedulesCommand;
  let listSchedulesCommand: ListSchedulesCommand;
  let getTopicCommand: GetTopicsCommand; 
  let createTopicCommand: CreateTopicCommand;
  let jwtService: JwtService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SchedulesController],
      providers: [
        CancelScheduleCommand,
        {
          provide: PrismaService,
          useValue: prismaServiceMock,
        },
        {
          provide: EmailService,
          useValue: emailServiceMock,
        },
        EndScheduleCommand,
        {
          provide: PrismaService,
          useValue: endScheduleCommandMock,
        },
        ListEndingSchedulesCommand,
        {
          provide: PrismaService,
          useValue: listEndingSchedulesCommandMock,
        },
        GetTopicsCommand,
        {
          provide: PrismaService,
          useValue: getTopicsCommandMock,
        },
        ListSchedulesCommand,
        {
          provide: PrismaService,
          useValue: listSchedulesCommandMock,
        },
        CreateTopicCommand,
        {
          provide: PrismaService,
          useValue: createTopicCommandMock,
        },
        JwtService,
      ],
    }).compile();

    schedulesController = module.get<SchedulesController>(SchedulesController);
    cancelScheduleCommand = module.get<CancelScheduleCommand>(CancelScheduleCommand);
    endScheduleCommand = module.get<EndScheduleCommand>(EndScheduleCommand);
    listEndingSchedulesCommand = module.get<ListEndingSchedulesCommand>(ListEndingSchedulesCommand);
    getTopicCommand=module.get<GetTopicsCommand>(GetTopicsCommand);
    listSchedulesCommand=module.get<ListSchedulesCommand>(ListSchedulesCommand);
    createTopicCommand=module.get<CreateTopicCommand>(CreateTopicCommand);

    jwtService = module.get<JwtService>(JwtService);
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('endSchedule', () => {
    it('should end a schedule successfully', async () => {
      // GIVEN
      const endSchedule = SchedulePrismaFactory.build({});
      prismaServiceMock.scheduleMonitoring.findUnique.mockReturnValueOnce(
        endSchedule,
      );

      const scheduleId = endSchedule.id;
      const userId = endSchedule.monitor.student.user.id;
      const realized = true;

      jest.spyOn(jwtService, 'decode').mockReturnValueOnce({ sub: userId });
      jest.spyOn(endScheduleCommand, 'execute').mockResolvedValueOnce();

      // WHEN
      const result = await schedulesController.endSchedule(
        { headers: { authorization: 'Bearer token' } } as any,
        { id: scheduleId } as any,
        { realized } as any,
      );

      // THEN
      expect(jwtService.decode).toHaveBeenCalledWith('token');
      expect(endScheduleCommand.execute).toHaveBeenCalledWith(scheduleId, userId, realized);
      expect(result).toBeUndefined();
    });

    it('should throw ScheduleNotFoundException', async () => {
      // GIVEN
      const scheduleId = 1;
      const userId = 123;
      const realized = true;

      jest.spyOn(jwtService, 'decode').mockReturnValueOnce({ sub: userId });
      jest.spyOn(endScheduleCommand, 'execute').mockRejectedValueOnce(new NotFoundException('Schedule not found'));

      // WHEN
      try {
        await schedulesController.endSchedule(
          { headers: { authorization: 'Bearer token' } } as any,
          { id: scheduleId } as any,
          { realized } as any,
        );
      } catch (error) {
        // THEN
        expect(jwtService.decode).toHaveBeenCalledWith('token');
        expect(endScheduleCommand.execute).toHaveBeenCalledWith(scheduleId, userId, realized);
        expect(error).toBeInstanceOf(NotFoundException);
        expect(error.message).toBe('Schedule not found');
      }
    });
  });

  describe('create topic', () => {
    it('should create a topic successfully', async () => {
      // GIVEN
      const topicProps = TopicFactory.build({});
      
      jest.spyOn(createTopicCommandMock.scheduleTopics, 'create').mockResolvedValueOnce(topicProps);
  
      // WHEN
      const result = await schedulesController.createTopic(topicProps);
      jest.spyOn(endScheduleCommand, 'execute').mockResolvedValueOnce();
  
      // THEN
      expect(result).toBeDefined();
      expect(result.name).toEqual(topicProps.name); 
  });
});

  describe('cancel schedule', () => {
     describe('cancelSchedule', () => {
    it('should cancel a schedule successfully', async () => {
      // GIVEN
        const cancelSchedule = SchedulePrismaFactory.build({});
        prismaServiceMock.scheduleMonitoring.findUnique.mockReturnValueOnce(
        cancelSchedule,
      );

      const scheduleId = cancelSchedule.id;
      const userId = cancelSchedule.monitor.student.user.id;

      jest.spyOn(jwtService, 'decode').mockReturnValueOnce({ sub: userId });
      jest.spyOn(cancelScheduleCommand, 'execute').mockResolvedValueOnce();

      // WHEN
      const result = await schedulesController.cancelSchedule(
        { headers: { authorization: 'Bearer token' } } as any,
        { id: scheduleId } as any
      );

      // THEN
      expect(jwtService.decode).toHaveBeenCalledWith('token');
      expect(cancelScheduleCommand.execute).toHaveBeenCalledWith(scheduleId, userId);
      expect(result).toBeUndefined();
    });

    it('should throw ScheduleNotFoundException', async () => {
      // GIVEN
        const cancelSchedule = SchedulePrismaFactory.build({});
        prismaServiceMock.scheduleMonitoring.findUnique.mockReturnValueOnce(
        cancelSchedule,
      );
      const scheduleId = cancelSchedule.id;
      const userId = cancelSchedule.monitor.student.user.id;

      jest.spyOn(jwtService, 'decode').mockReturnValueOnce({ sub: userId });
      jest.spyOn(cancelScheduleCommand, 'execute').mockRejectedValueOnce(new NotFoundException('Schedule not found'));

      
      // WHEN
      try {
        await schedulesController.cancelSchedule(
          { headers: { authorization: 'Bearer token' } } as any,
          { id: scheduleId } as any
        );
      } catch (error) {
        // THEN
        expect(jwtService.decode).toHaveBeenCalledWith('token');
        expect(cancelScheduleCommand.execute).toHaveBeenCalledWith(scheduleId, userId);
        expect(error).toBeInstanceOf(NotFoundException);
        expect(error.message).toBe('Schedule not found');
      }
    });
  });
  });


  describe('get topic', () => {
    it('should get topics successfully', async () => {
      // GIVEN
      const topicProps = TopicFactory.build({});

      jest.spyOn(getTopicCommand, 'execute').mockResolvedValueOnce(topicProps);

      // When
      const result = await schedulesController.getTopics(topicProps);

      // Then
      expect(result).toBeDefined();
    });

    it('should handle errors properly', async () => {
      // Given
      const topicProps = TopicFactory.build({});

      jest.spyOn(getTopicCommand, 'execute').mockRejectedValueOnce(new Error('error'));

      // When 
      //Then
      await expect(schedulesController.getTopics(topicProps)).rejects.toThrowError('error');
    });
  });
});
