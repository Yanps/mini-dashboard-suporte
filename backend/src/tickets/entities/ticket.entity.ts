import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type TicketDocument = Ticket & Document;

export enum TicketStatus {
  OPEN = 'open',
  IN_PROGRESS = 'in_progress',
  RESOLVED = 'resolved',
  CLOSED = 'closed',
}

export enum TicketPriority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  URGENT = 'urgent',
}

@Schema({ timestamps: true })
export class Ticket {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  description: string;

  @Prop({ 
    type: String, 
    enum: TicketStatus, 
    default: TicketStatus.OPEN 
  })
  status: TicketStatus;

  @Prop({ 
    type: String, 
    enum: TicketPriority, 
    default: TicketPriority.MEDIUM 
  })
  priority: TicketPriority;

  @Prop({ required: true })
  requesterEmail: string;

  @Prop({ type: [Object], default: [] })
  history: {
    timestamp: Date;
    action: string;
    oldValue?: string;
    newValue?: string;
    changedBy?: string;
  }[];

  @Prop()
  assignedTo?: string;

  @Prop()
  resolvedAt?: Date;

  @Prop()
  closedAt?: Date;
}

export const TicketSchema = SchemaFactory.createForClass(Ticket);


