import { IsEmail, IsEnum, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { TicketStatus, TicketPriority } from '../entities/ticket.entity';

export class FilterTicketDto {
  @ApiProperty({ 
    description: 'Status do ticket para filtrar',
    enum: TicketStatus,
    required: false
  })
  @IsOptional()
  @IsEnum(TicketStatus)
  status?: TicketStatus;

  @ApiProperty({ 
    description: 'Prioridade do ticket para filtrar',
    enum: TicketPriority,
    required: false
  })
  @IsOptional()
  @IsEnum(TicketPriority)
  priority?: TicketPriority;

  @ApiProperty({ description: 'Email do solicitante para filtrar', required: false })
  @IsOptional()
  @IsEmail()
  requesterEmail?: string;

  @ApiProperty({ description: 'Usuário responsável para filtrar', required: false })
  @IsOptional()
  @IsString()
  assignedTo?: string;

  @ApiProperty({ description: 'Busca por título ou descrição', required: false })
  @IsOptional()
  @IsString()
  search?: string;
}


