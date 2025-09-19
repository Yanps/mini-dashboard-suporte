import { Test, TestingModule } from '@nestjs/testing';
import { TicketsController } from './tickets.controller';
import { TicketsService } from '../services/tickets.service';
import { CreateTicketDto, UpdateTicketDto } from '../dto';
import { TicketStatus, TicketPriority } from '../entities/ticket.entity';

describe('TicketsController', () => {
  let controller: TicketsController;
  let service: TicketsService;

  const mockTicket = {
    _id: '507f1f77bcf86cd799439011',
    title: 'Test Ticket',
    description: 'Test Description',
    status: TicketStatus.OPEN,
    priority: TicketPriority.MEDIUM,
    requesterEmail: 'test@example.com',
    history: [],
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockTicketsService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    findByEmail: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
    getStats: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TicketsController],
      providers: [
        {
          provide: TicketsService,
          useValue: mockTicketsService,
        },
      ],
    }).compile();

    controller = module.get<TicketsController>(TicketsController);
    service = module.get<TicketsService>(TicketsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a ticket', async () => {
      const createTicketDto: CreateTicketDto = {
        title: 'Test Ticket',
        description: 'Test Description',
        priority: TicketPriority.MEDIUM,
        requesterEmail: 'test@example.com',
      };

      mockTicketsService.create.mockResolvedValue(mockTicket);

      const result = await controller.create(createTicketDto);

      expect(result).toEqual(mockTicket);
      expect(service.create).toHaveBeenCalledWith(createTicketDto);
    });
  });

  describe('findAll', () => {
    it('should return an array of tickets', async () => {
      const tickets = [mockTicket];
      mockTicketsService.findAll.mockResolvedValue(tickets);

      const result = await controller.findAll({});

      expect(result).toEqual(tickets);
      expect(service.findAll).toHaveBeenCalledWith({});
    });
  });

  describe('findOne', () => {
    it('should return a ticket', async () => {
      mockTicketsService.findOne.mockResolvedValue(mockTicket);

      const result = await controller.findOne('507f1f77bcf86cd799439011');

      expect(result).toEqual(mockTicket);
      expect(service.findOne).toHaveBeenCalledWith('507f1f77bcf86cd799439011');
    });
  });

  describe('findByEmail', () => {
    it('should return tickets by email', async () => {
      const tickets = [mockTicket];
      mockTicketsService.findByEmail.mockResolvedValue(tickets);

      const result = await controller.findByEmail('test@example.com');

      expect(result).toEqual(tickets);
      expect(service.findByEmail).toHaveBeenCalledWith('test@example.com');
    });
  });

  describe('update', () => {
    it('should update a ticket', async () => {
      const updateTicketDto: UpdateTicketDto = {
        status: TicketStatus.IN_PROGRESS,
      };
      const updatedTicket = { ...mockTicket, status: TicketStatus.IN_PROGRESS };

      mockTicketsService.update.mockResolvedValue(updatedTicket);

      const result = await controller.update('507f1f77bcf86cd799439011', updateTicketDto);

      expect(result).toEqual(updatedTicket);
      expect(service.update).toHaveBeenCalledWith('507f1f77bcf86cd799439011', updateTicketDto);
    });
  });

  describe('remove', () => {
    it('should remove a ticket', async () => {
      mockTicketsService.remove.mockResolvedValue(undefined);

      const result = await controller.remove('507f1f77bcf86cd799439011');

      expect(result).toBeUndefined();
      expect(service.remove).toHaveBeenCalledWith('507f1f77bcf86cd799439011');
    });
  });

  describe('getStats', () => {
    it('should return ticket statistics', async () => {
      const stats = {
        byStatus: { open: 5, in_progress: 3, resolved: 2, closed: 1 },
        byPriority: { low: 2, medium: 6, high: 3, urgent: 0 },
        total: 11,
      };

      mockTicketsService.getStats.mockResolvedValue(stats);

      const result = await controller.getStats();

      expect(result).toEqual(stats);
      expect(service.getStats).toHaveBeenCalled();
    });
  });
});

