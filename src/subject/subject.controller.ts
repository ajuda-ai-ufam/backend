import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  BadRequestException,
  NotFoundException,
  Param,
  Patch,
  PreconditionFailedException,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { SubjectQueryDto } from './dto/subject-query.dto';
import { IResponsePaginate } from 'src/common/interfaces/pagination.interface';
import { SubjectService } from './subject.service';
import { JWTUser } from 'src/auth/interfaces/jwt-user.interface';
import { EndResponsabilityCommand } from './commands/end-responsability-command';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { Role } from 'src/auth/enums/role.enum';
import { Request } from 'express';
import {
  AlreadyFinishedException,
  BlockingMonitorsException,
  ResponsabilityNotFoundException,
  UserNotStudentException,
} from './utils/exceptions';

@Controller('subject')
@ApiTags('Subjects')
export class SubjectController {
  constructor(
    private readonly subjectService: SubjectService,
    private readonly endResponsabilityCommand: EndResponsabilityCommand,
    private jwtService: JwtService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ description: 'Rota para listar todas as disciplinas.' })
  @Get()
  async findAll(
    @Req() req: Request,
    @Query() query: SubjectQueryDto,
  ): Promise<IResponsePaginate> {
    const token = req.headers.authorization.toString().replace('Bearer ', '');
    const user = this.jwtService.decode(token) as JWTUser;

    try {
      return await this.subjectService.findAll(
        user.sub,
        user.type_user.type,
        query,
      );
    } catch (error) {
      if (error instanceof UserNotStudentException) {
        throw new BadRequestException(error.message);
      }

      throw error;
    }
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Get(':id')
  async findOne(@Req() req: Request, @Param('id') id: number) {
    const token = req.headers.authorization.toString().replace('Bearer ', '');
    const user = this.jwtService.decode(token) as JWTUser;

    return await this.subjectService.findSubjectById(user.sub, id);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Roles(Role.Coordinator)
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    summary: 'Atualiza o status de uma responsabilidade para 3 (finalizada)',
  })
  @Patch('responsability/:id/end')
  async endResponsability(@Param('id') id: number) {
    try {
      return await this.endResponsabilityCommand.execute(id);
    } catch (error) {
      if (error instanceof ResponsabilityNotFoundException) {
        throw new NotFoundException(error.message);
      }

      if (
        error instanceof AlreadyFinishedException ||
        error instanceof BlockingMonitorsException
      ) {
        throw new PreconditionFailedException(error.message);
      }

      throw error;
    }
  }
}
