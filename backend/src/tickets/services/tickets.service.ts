import { Injectable, NotFoundException, Inject, forwardRef } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Ticket, TicketDocument, TicketStatus } from '../entities/ticket.entity';
import { CreateTicketDto, UpdateTicketDto, FilterTicketDto } from '../dto';
import { TicketsGateway } from '../gateways/tickets.gateway';

@Injectable()
export class TicketsService {
  constructor(
    @InjectModel(Ticket.name) private ticketModel: Model<TicketDocument>,
    @Inject(forwardRef(() => TicketsGateway))
    private ticketsGateway: TicketsGateway,
  ) {}

  async create(createTicketDto: CreateTicketDto): Promise<Ticket> {
    const createdTicket = new this.ticketModel({
      ...createTicketDto,
      history: [{
        timestamp: new Date(),
        action: 'created',
        changedBy: 'system',
      }],
    });
    const savedTicket = await createdTicket.save();
    
    // Emit real-time event
    this.ticketsGateway.emitTicketCreated(savedTicket);
    
    return savedTicket;
  }

  async findAll(filterDto?: FilterTicketDto): Promise<Ticket[]> {
    const query = this.buildFilterQuery(filterDto);
    return this.ticketModel.find(query).sort({ createdAt: -1 }).exec();
  }

  async findOne(id: string): Promise<Ticket> {
    const ticket = await this.ticketModel.findById(id).exec();
    if (!ticket) {
      throw new NotFoundException(`Ticket with ID ${id} not found`);
    }
    return ticket;
  }

  async findByEmail(email: string): Promise<Ticket[]> {
    return this.ticketModel
      .find({ requesterEmail: email })
      .sort({ createdAt: -1 })
      .exec();
  }

  async update(id: string, updateTicketDto: UpdateTicketDto): Promise<Ticket> {
    const existingTicket = await this.findOne(id);
    
    // Build history entry for changes
    const historyEntries = [];
    const timestamp = new Date();

    if (updateTicketDto.status && updateTicketDto.status !== existingTicket.status) {
      historyEntries.push({
        timestamp,
        action: 'status_changed',
        oldValue: existingTicket.status,
        newValue: updateTicketDto.status,
        changedBy: 'admin',
      });

      // Set resolved/closed timestamps
      if (updateTicketDto.status === TicketStatus.RESOLVED) {
        updateTicketDto['resolvedAt'] = timestamp;
      } else if (updateTicketDto.status === TicketStatus.CLOSED) {
        updateTicketDto['closedAt'] = timestamp;
      }
    }

    if (updateTicketDto.priority && updateTicketDto.priority !== existingTicket.priority) {
      historyEntries.push({
        timestamp,
        action: 'priority_changed',
        oldValue: existingTicket.priority,
        newValue: updateTicketDto.priority,
        changedBy: 'admin',
      });
    }

    if (updateTicketDto.assignedTo && updateTicketDto.assignedTo !== existingTicket.assignedTo) {
      historyEntries.push({
        timestamp,
        action: 'assigned',
        oldValue: existingTicket.assignedTo || 'unassigned',
        newValue: updateTicketDto.assignedTo,
        changedBy: 'admin',
      });
    }

    const updatedTicket = await this.ticketModel
      .findByIdAndUpdate(
        id,
        {
          ...updateTicketDto,
          $push: { history: { $each: historyEntries } },
        },
        { new: true },
      )
      .exec();

    // Emit real-time event
    this.ticketsGateway.emitTicketUpdated(updatedTicket);

    return updatedTicket;
  }

  async remove(id: string): Promise<void> {
    const result = await this.ticketModel.deleteOne({ _id: id }).exec();
    if (result.deletedCount === 0) {
      throw new NotFoundException(`Ticket with ID ${id} not found`);
    }
    
    // Emit real-time event
    this.ticketsGateway.emitTicketDeleted(id);
  }

  async getStats(): Promise<any> {
    const stats = await this.ticketModel.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
        },
      },
    ]);

    const priorityStats = await this.ticketModel.aggregate([
      {
        $group: {
          _id: '$priority',
          count: { $sum: 1 },
        },
      },
    ]);

    return {
      byStatus: stats.reduce((acc, stat) => {
        acc[stat._id] = stat.count;
        return acc;
      }, {}),
      byPriority: priorityStats.reduce((acc, stat) => {
        acc[stat._id] = stat.count;
        return acc;
      }, {}),
      total: await this.ticketModel.countDocuments(),
    };
  }

  private buildFilterQuery(filterDto?: FilterTicketDto): any {
    const query: any = {};

    if (!filterDto) return query;

    if (filterDto.status) {
      query.status = filterDto.status;
    }

    if (filterDto.priority) {
      query.priority = filterDto.priority;
    }

    if (filterDto.requesterEmail) {
      query.requesterEmail = filterDto.requesterEmail;
    }

    if (filterDto.assignedTo) {
      query.assignedTo = filterDto.assignedTo;
    }

    if (filterDto.search) {
      query.$or = [
        { title: { $regex: filterDto.search, $options: 'i' } },
        { description: { $regex: filterDto.search, $options: 'i' } },
      ];
    }

    return query;
  }
}
