import { Controller, Get, HttpCode, HttpStatus, Param, Patch, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { QueryPaginationDto } from 'src/common/dto/query-pagination.dto';
import { IResponsePaginate } from 'src/common/interfaces/pagination.interface';
import { SubjectService } from './subject.service';
import { EndResponsabilityCommand } from './commands/end-responsability-command';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { Role } from 'src/auth/enums/role.enum';

@Controller('subject')
@ApiTags('Subjects')
export class SubjectController {
  constructor(
    private readonly subjectService: SubjectService,
    private readonly endResponsabilityCommand: EndResponsabilityCommand
    ) {}

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ description: 'Rota para listar todas as disciplinas.' })
  @Get()
  async findAll(
    @Query() query: QueryPaginationDto,
  ): Promise<IResponsePaginate> {
    return await this.subjectService.findAll(query);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Get(':id')
  async findOne(@Param('id') id: number) {
    return await this.subjectService.listSubjects(id);
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
    return await this.endResponsabilityCommand.execute(id);
  }
}
