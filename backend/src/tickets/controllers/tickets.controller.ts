import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  ValidationPipe,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { TicketsService } from '../services/tickets.service';
import { CreateTicketDto, UpdateTicketDto, FilterTicketDto } from '../dto';
import { Ticket } from '../entities/ticket.entity';

@ApiTags('tickets')
@Controller('tickets')
export class TicketsController {
  constructor(private readonly ticketsService: TicketsService) {}

  @Post()
  @ApiOperation({ summary: 'Criar um novo ticket' })
  @ApiResponse({ status: 201, description: 'Ticket criado com sucesso.' })
  @ApiResponse({ status: 400, description: 'Dados inválidos.' })
  create(@Body(ValidationPipe) createTicketDto: CreateTicketDto): Promise<Ticket> {
    return this.ticketsService.create(createTicketDto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar todos os tickets com filtros opcionais' })
  @ApiResponse({ status: 200, description: 'Lista de tickets retornada com sucesso.' })
  @ApiQuery({ name: 'status', required: false, description: 'Filtrar por status' })
  @ApiQuery({ name: 'priority', required: false, description: 'Filtrar por prioridade' })
  @ApiQuery({ name: 'requesterEmail', required: false, description: 'Filtrar por email do solicitante' })
  @ApiQuery({ name: 'assignedTo', required: false, description: 'Filtrar por responsável' })
  @ApiQuery({ name: 'search', required: false, description: 'Buscar por título ou descrição' })
  findAll(@Query(ValidationPipe) filterDto: FilterTicketDto): Promise<Ticket[]> {
    return this.ticketsService.findAll(filterDto);
  }

  @Get('stats')
  @ApiOperation({ summary: 'Obter estatísticas dos tickets' })
  @ApiResponse({ status: 200, description: 'Estatísticas retornadas com sucesso.' })
  getStats() {
    return this.ticketsService.getStats();
  }

  @Get('by-email/:email')
  @ApiOperation({ summary: 'Buscar tickets por email do solicitante' })
  @ApiResponse({ status: 200, description: 'Tickets do usuário retornados com sucesso.' })
  findByEmail(@Param('email') email: string): Promise<Ticket[]> {
    return this.ticketsService.findByEmail(email);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar ticket por ID' })
  @ApiResponse({ status: 200, description: 'Ticket encontrado.' })
  @ApiResponse({ status: 404, description: 'Ticket não encontrado.' })
  findOne(@Param('id') id: string): Promise<Ticket> {
    return this.ticketsService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Atualizar um ticket' })
  @ApiResponse({ status: 200, description: 'Ticket atualizado com sucesso.' })
  @ApiResponse({ status: 404, description: 'Ticket não encontrado.' })
  update(
    @Param('id') id: string,
    @Body(ValidationPipe) updateTicketDto: UpdateTicketDto,
  ): Promise<Ticket> {
    return this.ticketsService.update(id, updateTicketDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Deletar um ticket' })
  @ApiResponse({ status: 200, description: 'Ticket deletado com sucesso.' })
  @ApiResponse({ status: 404, description: 'Ticket não encontrado.' })
  remove(@Param('id') id: string): Promise<void> {
    return this.ticketsService.remove(id);
  }
}


