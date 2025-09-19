export enum TicketStatus {
  OPEN = 'open',
  IN_PROGRESS = 'in_progress',
  RESOLVED = 'resolved',
  CLOSED = 'closed'
}

export enum TicketPriority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  URGENT = 'urgent'
}

export interface HistoryEntry {
  timestamp: Date;
  action: string;
  oldValue?: string;
  newValue?: string;
  changedBy?: string;
}

export interface Ticket {
  _id?: string;
  title: string;
  description: string;
  status: TicketStatus;
  priority: TicketPriority;
  requesterEmail: string;
  history: HistoryEntry[];
  assignedTo?: string;
  resolvedAt?: Date;
  closedAt?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface CreateTicketDto {
  title: string;
  description: string;
  priority?: TicketPriority;
  requesterEmail: string;
}

export interface UpdateTicketDto {
  status?: TicketStatus;
  priority?: TicketPriority;
  assignedTo?: string;
}

export interface FilterTicketDto {
  status?: TicketStatus;
  priority?: TicketPriority;
  requesterEmail?: string;
  assignedTo?: string;
  search?: string;
}

export interface TicketStats {
  byStatus: { [key: string]: number };
  byPriority: { [key: string]: number };
  total: number;
}


