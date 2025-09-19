import { IsEnum, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { TicketStatus, TicketPriority } from '../entities/ticket.entity';

export class UpdateTicketDto {
  @ApiProperty({ 
    description: 'Status do ticket',
    enum: TicketStatus,
    required: false
  })
  @IsOptional()
  @IsEnum(TicketStatus)
  status?: TicketStatus;

  @ApiProperty({ 
    description: 'Prioridade do ticket',
    enum: TicketPriority,
    required: false
  })
  @IsOptional()
  @IsEnum(TicketPriority)
  priority?: TicketPriority;

  @ApiProperty({ description: 'Usuário responsável pelo ticket', required: false })
  @IsOptional()
  @IsString()
  assignedTo?: string;
}


