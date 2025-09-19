import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { TicketsService } from './tickets.service';
import { TicketsGateway } from '../gateways/tickets.gateway';
import { Ticket, TicketDocument, TicketStatus, TicketPriority } from '../entities/ticket.entity';
import { CreateTicketDto, UpdateTicketDto } from '../dto';

describe('TicketsService', () => {
  let service: TicketsService;
  let model: Model<TicketDocument>;
  let gateway: TicketsGateway;

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

  const mockTicketModel = {
    new: jest.fn().mockResolvedValue(mockTicket),
    constructor: jest.fn().mockResolvedValue(mockTicket),
    find: jest.fn(),
    findById: jest.fn(),
    findByIdAndUpdate: jest.fn(),
    deleteOne: jest.fn(),
    countDocuments: jest.fn(),
    aggregate: jest.fn(),
    exec: jest.fn(),
    save: jest.fn(),
  };

  const mockGateway = {
    emitTicketCreated: jest.fn(),
    emitTicketUpdated: jest.fn(),
    emitTicketDeleted: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TicketsService,
        {
          provide: getModelToken(Ticket.name),
          useValue: mockTicketModel,
        },
        {
          provide: TicketsGateway,
          useValue: mockGateway,
        },
      ],
    }).compile();

    service = module.get<TicketsService>(TicketsService);
    model = module.get<Model<TicketDocument>>(getModelToken(Ticket.name));
    gateway = module.get<TicketsGateway>(TicketsGateway);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a ticket', async () => {
      const createTicketDto: CreateTicketDto = {
        title: 'Test Ticket',
        description: 'Test Description',
        priority: TicketPriority.MEDIUM,
        requesterEmail: 'test@example.com',
      };

      const mockSave = jest.fn().mockResolvedValue(mockTicket);
      mockTicketModel.save = mockSave;

      // Mock the constructor to return an object with save method
      jest.spyOn(model, 'constructor' as any).mockImplementation(() => ({
        ...createTicketDto,
        history: [{ timestamp: expect.any(Date), action: 'created', changedBy: 'system' }],
        save: mockSave,
      }));

      const result = await service.create(createTicketDto);

      expect(result).toEqual(mockTicket);
      expect(mockSave).toHaveBeenCalled();
      expect(gateway.emitTicketCreated).toHaveBeenCalledWith(mockTicket);
    });
  });

  describe('findAll', () => {
    it('should return an array of tickets', async () => {
      const tickets = [mockTicket];
      mockTicketModel.find.mockReturnValue({
        sort: jest.fn().mockReturnValue({
          exec: jest.fn().mockResolvedValue(tickets),
        }),
      });

      const result = await service.findAll();

      expect(result).toEqual(tickets);
      expect(mockTicketModel.find).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a ticket', async () => {
      mockTicketModel.findById.mockReturnValue({
        exec: jest.fn().mockResolvedValue(mockTicket),
      });

      const result = await service.findOne('507f1f77bcf86cd799439011');

      expect(result).toEqual(mockTicket);
      expect(mockTicketModel.findById).toHaveBeenCalledWith('507f1f77bcf86cd799439011');
    });

    it('should throw NotFoundException when ticket not found', async () => {
      mockTicketModel.findById.mockReturnValue({
        exec: jest.fn().mockResolvedValue(null),
      });

      await expect(service.findOne('nonexistent')).rejects.toThrow('Ticket with ID nonexistent not found');
    });
  });

  describe('update', () => {
    it('should update a ticket', async () => {
      const updateTicketDto: UpdateTicketDto = {
        status: TicketStatus.IN_PROGRESS,
      };

      const updatedTicket = { ...mockTicket, status: TicketStatus.IN_PROGRESS };

      mockTicketModel.findById.mockReturnValue({
        exec: jest.fn().mockResolvedValue(mockTicket),
      });

      mockTicketModel.findByIdAndUpdate.mockReturnValue({
        exec: jest.fn().mockResolvedValue(updatedTicket),
      });

      const result = await service.update('507f1f77bcf86cd799439011', updateTicketDto);

      expect(result).toEqual(updatedTicket);
      expect(gateway.emitTicketUpdated).toHaveBeenCalledWith(updatedTicket);
    });
  });

  describe('remove', () => {
    it('should remove a ticket', async () => {
      mockTicketModel.deleteOne.mockReturnValue({
        exec: jest.fn().mockResolvedValue({ deletedCount: 1 }),
      });

      await service.remove('507f1f77bcf86cd799439011');

      expect(mockTicketModel.deleteOne).toHaveBeenCalledWith({ _id: '507f1f77bcf86cd799439011' });
      expect(gateway.emitTicketDeleted).toHaveBeenCalledWith('507f1f77bcf86cd799439011');
    });

    it('should throw NotFoundException when ticket not found', async () => {
      mockTicketModel.deleteOne.mockReturnValue({
        exec: jest.fn().mockResolvedValue({ deletedCount: 0 }),
      });

      await expect(service.remove('nonexistent')).rejects.toThrow('Ticket with ID nonexistent not found');
    });
  });
});

